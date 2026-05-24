-- ============================================================================
-- Add Music Type Column to Tracks Table
-- ============================================================================
-- 実行場所：Supabase ダッシュボード → SQL エディタ
--
-- 目的：
-- ランキングページで音源（オーディオ）と動画（ビデオ）をカテゴリ分けするための
-- music_type カラムを tracks テーブルに追加します
-- ============================================================================

-- ============================================================================
-- ステップ 1: Tracks テーブルに music_type カラムを追加
-- ============================================================================
-- 注：既に存在する場合はスキップされます
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS music_type VARCHAR(20) DEFAULT 'audio'
CHECK (music_type IN ('audio', 'video'));

-- ============================================================================
-- ステップ 2: インデックスを作成（フィルタリングパフォーマンス向上）
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tracks_music_type ON public.tracks(music_type);
CREATE INDEX IF NOT EXISTS idx_tracks_music_type_created ON public.tracks(music_type, created_at DESC);

-- ============================================================================
-- ステップ 3: get_rankings_by_period 関数を更新
-- ============================================================================
-- music_type フィールドを返すように関数を更新
-- （既に music_type が含まれている場合はこのステップは不要）
--
-- 注：既存の関数定義をチェックしてください。
-- 必要に応じて以下を実行してください：

DROP FUNCTION IF EXISTS public.get_rankings_by_period(timestamp with time zone);
CREATE OR REPLACE FUNCTION public.get_rankings_by_period(period_start TIMESTAMP WITH TIME ZONE)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  title TEXT,
  artist_name TEXT,
  ai_tool TEXT,
  genre TEXT,
  music_type TEXT,
  prompt TEXT,
  external_url TEXT,
  play_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_play_count_at TIMESTAMP WITH TIME ZONE,
  artist_social_url TEXT,
  social_links JSONB,
  like_count BIGINT
) LANGUAGE SQL STABLE SET search_path = 'public'
AS $$
  SELECT
    t.id,
    t.user_id,
    t.title,
    t.artist_name,
    t.ai_tool,
    t.genre,
    COALESCE(t.music_type, 'audio') as music_type,
    t.prompt,
    t.external_url,
    t.play_count,
    t.created_at,
    t.last_play_count_at,
    t.artist_social_url,
    COALESCE(t.social_links, '{}'::jsonb) as social_links,
    COALESCE(COUNT(l.id), 0) as like_count
  FROM public.tracks t
  LEFT JOIN public.likes l ON t.id = l.track_id
  WHERE t.created_at >= period_start
  GROUP BY
    t.id,
    t.user_id,
    t.title,
    t.artist_name,
    t.ai_tool,
    t.genre,
    t.music_type,
    t.prompt,
    t.external_url,
    t.play_count,
    t.created_at,
    t.last_play_count_at,
    t.artist_social_url,
    t.social_links
  ORDER BY (COUNT(l.id) + t.play_count) DESC;
$$;

-- ============================================================================
-- ステップ 4: track_rankings ビューを更新
-- ============================================================================
DROP VIEW IF EXISTS public.track_rankings CASCADE;
CREATE VIEW public.track_rankings AS
SELECT
  t.id,
  t.user_id,
  t.title,
  t.artist_name,
  t.ai_tool,
  t.genre,
  COALESCE(t.music_type, 'audio') as music_type,
  t.prompt,
  t.external_url,
  t.play_count,
  t.created_at,
  t.last_play_count_at,
  t.artist_social_url,
  t.social_links,
  COUNT(l.id) as like_count,
  (COUNT(l.id) + t.play_count) as total_score
FROM public.tracks t
LEFT JOIN public.likes l ON t.id = l.track_id
GROUP BY t.id
ORDER BY total_score DESC;

-- ============================================================================
-- ステップ 5: ストアドプロシージャ（フィルタリング用）
-- ============================================================================
-- music_type でフィルタリングしたランキングを取得する関数
DROP FUNCTION IF EXISTS public.get_rankings_by_period_and_type(
  timestamp with time zone,
  VARCHAR
);

CREATE OR REPLACE FUNCTION public.get_rankings_by_period_and_type(
  period_start TIMESTAMP WITH TIME ZONE,
  filter_music_type VARCHAR
)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  title TEXT,
  artist_name TEXT,
  ai_tool TEXT,
  genre TEXT,
  music_type TEXT,
  prompt TEXT,
  external_url TEXT,
  play_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_play_count_at TIMESTAMP WITH TIME ZONE,
  artist_social_url TEXT,
  social_links JSONB,
  like_count BIGINT
) LANGUAGE SQL STABLE SET search_path = 'public'
AS $$
  SELECT
    t.id,
    t.user_id,
    t.title,
    t.artist_name,
    t.ai_tool,
    t.genre,
    COALESCE(t.music_type, 'audio') as music_type,
    t.prompt,
    t.external_url,
    t.play_count,
    t.created_at,
    t.last_play_count_at,
    t.artist_social_url,
    COALESCE(t.social_links, '{}'::jsonb) as social_links,
    COALESCE(COUNT(l.id), 0) as like_count
  FROM public.tracks t
  LEFT JOIN public.likes l ON t.id = l.track_id
  WHERE t.created_at >= period_start
    AND (filter_music_type = 'all' OR COALESCE(t.music_type, 'audio') = filter_music_type)
  GROUP BY
    t.id,
    t.user_id,
    t.title,
    t.artist_name,
    t.ai_tool,
    t.genre,
    t.music_type,
    t.prompt,
    t.external_url,
    t.play_count,
    t.created_at,
    t.last_play_count_at,
    t.artist_social_url,
    t.social_links
  ORDER BY (COUNT(l.id) + t.play_count) DESC;
$$;

-- ============================================================================
-- ステップ 6: 既存データのデフォルト値を設定（オプション）
-- ============================================================================
-- 既に music_type が NULL のレコードを 'audio' で埋める
UPDATE public.tracks
SET music_type = 'audio'
WHERE music_type IS NULL;

-- ============================================================================
-- ステップ 7: 動画と判定するトラックを手動で更新（オプション）
-- ============================================================================
-- 例：external_url が YouTube を含む場合、music_type を 'video' に設定
-- （これは手動で管理するか、管理画面から設定することを想定）
--
-- UPDATE public.tracks
-- SET music_type = 'video'
-- WHERE external_url LIKE '%youtube.com%'
-- AND music_type != 'video';

-- ============================================================================
-- 完了メッセージ
-- ============================================================================
-- SELECT 'Music type feature added successfully!' as message;
