// Script to seed test campaign data
// Run with: npx ts-node scripts/seed-campaigns.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCampaigns() {
  try {
    console.log('🌱 Seeding campaign data...');

    // Use a fixed test user ID
    const userId = '00000000-0000-0000-0000-000000000001';

    // Create test campaign themes
    console.log('📝 Creating campaign themes...');
    const { data: themes } = await supabase
      .from('campaign_themes')
      .insert([
        {
          submitted_by: userId,
          title: '地元のスポーツチームを応援する曲',
          description: '地元の力を信じて、音楽で応援したい！みんなの思いが詰まった曲を作ってください',
          status: 'selected',
          votes_count: 125,
        },
      ])
      .select();

    const themeId = themes?.[0]?.id;
    console.log('✅ Created theme:', themeId);

    // Create test campaign
    if (themeId) {
      const { data: campaigns } = await supabase
        .from('campaigns')
        .insert([
          {
            created_by: userId,
            theme_id: themeId,
            title: '地元のスポーツチームを応援する曲',
            description: 'このキャンペーンについて：地元のスポーツチームを応援するテーマで、チームへの思いや応援メッセージが込められた曲を募集しています。みんなで一緒に「応援ソング」を作ろう！',
            start_date: new Date('2026-06-01'),
            end_date: new Date('2026-06-30'),
            is_active: true,
          },
        ])
        .select();

      console.log('✅ Created campaign:', campaigns?.[0]?.id);
    }

    console.log('🎉 Campaign data seeded successfully!');
  } catch (error) {
    console.error('Error seeding campaigns:', error);
  }
}

seedCampaigns();
