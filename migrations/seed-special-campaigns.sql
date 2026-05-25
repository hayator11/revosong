-- Special Campaigns: Revo Art Project & Onokun Art Caravan
-- User ID: ffdca163-9b9c-47d0-a327-fb3712f86fbe (ishishinokai@gmail.com)

-- Insert Revo Art Project theme
INSERT INTO campaign_themes (submitted_by, title, description, status, votes_count, created_at, updated_at)
VALUES (
  'ffdca163-9b9c-47d0-a327-fb3712f86fbe'::uuid,
  '🎨 Revo Art Project - 見るアートではなく、関わるアート',
  '街にいろどりを。地域に記憶を。アーティストに社会的な役割を。参加型アートプロジェクトの精神で、応援の力を音楽に。',
  'selected',
  250,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING
RETURNING id INTO revo_theme_id;

-- Insert Onokun Art Caravan theme
INSERT INTO campaign_themes (submitted_by, title, description, status, votes_count, created_at, updated_at)
VALUES (
  'ffdca163-9b9c-47d0-a327-fb3712f86fbe'::uuid,
  '🚐 Onokun Art Caravan - 街にいろどりを',
  '参加者が「自分の街をもっと好きになるきっかけ」と「新しい自分に出会うきっかけ」を得る共創型プロジェクト。応援の輪で街を彩ろう。',
  'selected',
  198,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING
RETURNING id INTO onokun_theme_id;

-- Create Revo Art Project campaign
INSERT INTO campaigns (created_by, theme_id, title, description, start_date, end_date, submission_start, submission_end, is_active, created_at, updated_at)
SELECT
  'ffdca163-9b9c-47d0-a327-fb3712f86fbe'::uuid,
  id,
  '🎨 Revo Art Project - 見るアートではなく、関わるアート',
  'このキャンペーンについて：街にいろどりを。地域に記憶を。アーティストに社会的な役割を。

Revo Art Project は、参加型アートのコンセプトを音楽に応用したキャンペーンです。
「見るアートではなく、関わるアート」として、あなたの応援したい想いをテーマに、
アーティストたちが応答して曲を制作します。

応援の力で、街に色を加える新しい文化を一緒に作りませんか？',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '30 days',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '25 days',
  true,
  NOW(),
  NOW()
FROM campaign_themes
WHERE title = '🎨 Revo Art Project - 見るアートではなく、関わるアート'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Create Onokun Art Caravan campaign
INSERT INTO campaigns (created_by, theme_id, title, description, start_date, end_date, submission_start, submission_end, is_active, created_at, updated_at)
SELECT
  'ffdca163-9b9c-47d0-a327-fb3712f86fbe'::uuid,
  id,
  '🚐 Onokun Art Caravan - 街にいろどりを',
  'このキャンペーンについて：参加者が「自分の街をもっと好きになるきっかけ」と「新しい自分に出会うきっかけ」を得るプロジェクト。

Onokun Art Caravan は、共創型アートプロジェクトの理念をREVASONGで表現しています。
月ごとのワークショップのように、定期的に応援のテーマを設定し、
コミュニティが協力して応援歌を生み出します。

地域愛と自己発見の体験を、音楽を通じて実現しましょう。',
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '28 days',
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '23 days',
  true,
  NOW(),
  NOW()
FROM campaign_themes
WHERE title = '🚐 Onokun Art Caravan - 街にいろどりを'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify inserted data
SELECT '✅ Special Campaigns created:' AS status;
SELECT id, title, start_date, end_date, is_active FROM campaigns
WHERE title LIKE '🎨%' OR title LIKE '🚐%'
ORDER BY created_at DESC;

SELECT '✅ Theme details:' AS status;
SELECT id, title, votes_count, status FROM campaign_themes
WHERE title LIKE '🎨%' OR title LIKE '🚐%'
ORDER BY created_at DESC;
