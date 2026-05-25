-- Test data for campaigns
-- Run this SQL in Supabase SQL Editor to create test campaign data

-- Get a user ID (or use a test one)
-- Replace the user_id with an actual user from your auth.users table
-- SELECT id FROM auth.users LIMIT 1;

INSERT INTO campaign_themes (submitted_by, title, description, status, votes_count, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '地元のスポーツチームを応援する曲',
  '地元の力を信じて、音楽で応援したい！みんなの思いが詰まった曲を作ってください',
  'selected',
  125,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING
RETURNING id;

-- Insert second theme
INSERT INTO campaign_themes (submitted_by, title, description, status, votes_count, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '新しい一歩を踏み出す自分への応援歌',
  '人生の転機を迎えた時、心を支えてくれる応援歌を募集しています',
  'selected',
  89,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Now insert campaigns (get the first theme ID from above)
INSERT INTO campaigns (created_by, theme_id, title, description, start_date, end_date, submission_start, submission_end, is_active, created_at, updated_at)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  id,
  title,
  'このキャンペーンについて：' || description,
  '2026-06-01'::timestamp,
  '2026-06-30'::timestamp,
  '2026-06-01'::timestamp,
  '2026-06-25'::timestamp,
  true,
  NOW(),
  NOW()
FROM campaign_themes
WHERE title = '地元のスポーツチームを応援する曲'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert second campaign
INSERT INTO campaigns (created_by, theme_id, title, description, start_date, end_date, submission_start, submission_end, is_active, created_at, updated_at)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  id,
  title,
  description,
  '2026-06-15'::timestamp,
  '2026-07-15'::timestamp,
  '2026-06-15'::timestamp,
  '2026-07-10'::timestamp,
  true,
  NOW(),
  NOW()
FROM campaign_themes
WHERE title = '新しい一歩を踏み出す自分への応援歌'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify inserted data
SELECT 'Campaigns created:' AS status;
SELECT id, title, start_date, end_date FROM campaigns ORDER BY created_at DESC LIMIT 2;
