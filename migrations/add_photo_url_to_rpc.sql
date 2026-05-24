-- Migration: Add photo_url field to get_rankings_by_period RPC function
-- Date: 2026-05-24
-- Description: Include photo_url in RPC function to support thumbnail display in ranking

-- Update RPC function to include photo_url
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
  photo_url TEXT,
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
    t.photo_url,
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
    t.social_links,
    t.photo_url
  ORDER BY (COUNT(l.id) + t.play_count) DESC;
$$;

-- Update track_rankings view to include photo_url
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
  t.photo_url,
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
  t.social_links,
  t.photo_url
ORDER BY (COUNT(l.id) + t.play_count) DESC;
