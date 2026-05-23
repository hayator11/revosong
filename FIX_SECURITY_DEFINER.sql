-- ============================================================================
-- Supabase SECURITY DEFINER エラー修正スクリプト
-- ============================================================================
-- 
-- 実行方法:
-- 1. https://app.supabase.com を開く
-- 2. プロジェクト "kxrukjykjwifawdlypfs" を選択
-- 3. SQL Editor を開く
-- 4. 以下のSQLを順番に実行
--
-- ============================================================================

-- ステップ 1: 既存のビューを削除
DROP VIEW IF EXISTS public.track_rankings CASCADE;

-- ステップ 2: 新しいビューを作成 (SECURITY DEFINER なし)
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
  t.artist_social_url
ORDER BY like_count DESC;

-- ステップ 3: 修正確認
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public' AND viewname = 'track_rankings';
