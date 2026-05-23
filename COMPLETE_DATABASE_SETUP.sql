-- ============================================================================
-- Complete Database Setup for Music Charts Application
-- ============================================================================
-- 実行場所：Supabase ダッシュボード → SQL エディタ
--
-- 以下の機能をセットアップします：
-- 1. SNS リンク機能 (social_links JSONB フィールド)
-- 2. コメント機能 (comments テーブル)
-- 3. ユーザープロフィール (profiles テーブル)
-- 4. ランキング関数の更新 (social_links フィールドを含める)
-- ============================================================================

-- ============================================================================
-- ステップ 1: Tracks テーブルに SNS リンク用カラムを追加
-- ============================================================================
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- ============================================================================
-- ステップ 2: Comments テーブルを作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  track_id BIGINT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ステップ 3: Profiles テーブルを作成（ユーザー情報を保存）
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ステップ 4: インデックスを作成（検索パフォーマンス向上）
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON public.comments(track_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_track_created ON public.comments(track_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- ステップ 5: Comments テーブルで RLS (Row Level Security) を有効化
-- ============================================================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 読み取り：誰でも可能
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

-- 作成：認証ユーザーのみ
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 更新：自分のコメントのみ
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 削除：自分のコメントのみ
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ステップ 6: Profiles テーブルで RLS を有効化
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 読み取り：誰でも可能
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Profiles are readable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- 作成：自分のプロフィールのみ
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 更新：自分のプロフィールのみ
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- ステップ 7: 新規ユーザーのプロフィールを自動作成するトリガー
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 既存のトリガーを削除（あれば）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 新しいトリガーを作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- ステップ 8: コメント＆ユーザー情報をまとめた View を作成
-- ============================================================================
DROP VIEW IF EXISTS public.comments_with_users CASCADE;
CREATE VIEW public.comments_with_users AS
SELECT
  c.id,
  c.track_id,
  c.user_id,
  c.content,
  c.created_at,
  c.updated_at,
  COALESCE(p.email, 'Anonymous') as user_email
FROM public.comments c
LEFT JOIN public.profiles p ON c.user_id = p.id;

-- ============================================================================
-- ステップ 9: ランキング関数を更新（social_links フィールドを含める）
-- ============================================================================

-- get_rankings_by_period 関数を更新
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
    t.music_type,
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

-- track_rankings ビューを更新
DROP VIEW IF EXISTS public.track_rankings CASCADE;
CREATE VIEW public.track_rankings AS
SELECT
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
  COALESCE(t.social_links, '{}'::jsonb) as social_links,
  COALESCE(COUNT(l.id), 0) as like_count
FROM public.tracks t
LEFT JOIN public.likes l ON t.id = l.track_id
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

-- ============================================================================
-- ステップ 10: 既存のトラックに social_links を移行（オプション）
-- ============================================================================
-- artist_social_url が設定されているトラックの social_links を初期化
UPDATE public.tracks
SET social_links =
  CASE
    WHEN artist_social_url IS NOT NULL
    THEN jsonb_build_object('x', artist_social_url)
    ELSE '{}'::jsonb
  END
WHERE social_links = '{}'::jsonb OR social_links IS NULL;

-- ============================================================================
-- ステップ 11: 検証クエリ（実行後に以下を確認）
-- ============================================================================
-- 以下のクエリを実行して、セットアップが成功したか確認してください：

-- テーブルが作成されたか確認
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('comments', 'profiles', 'tracks');

-- トリガーが作成されたか確認
-- SELECT trigger_name FROM information_schema.triggers
-- WHERE event_object_schema = 'public'
-- AND event_object_table = 'profiles';

-- View が作成されたか確認
-- SELECT viewname FROM pg_views
-- WHERE schemaname = 'public'
-- AND viewname IN ('track_rankings', 'comments_with_users');

-- コメント数を確認
-- SELECT COUNT(*) as comment_count FROM public.comments;

-- ============================================================================
-- セットアップ完了
-- ============================================================================
-- すべての実行が成功しました！
-- フロントエンドは以下の機能が利用可能になります：
-- 1. ✅ SNS マルチプラットフォーム対応（social_links JSONB フィールド）
-- 2. ✅ ユーザーコメント機能（comments テーブル）
-- 3. ✅ ユーザープロフィール管理（profiles テーブル）
-- 4. ✅ ランキング関数（likes + play_count）
