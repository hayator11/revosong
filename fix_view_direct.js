const { Client } = require('pg');
const client = new Client({
  host: 'aws-0-ap-northeast-1.db.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres.kxrukjykjwifawdlypfs',
  password: 'onokun0090onokun',
  ssl: { rejectUnauthorized: false }
});

async function fixDatabase() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✓ Connected\n');

    console.log('Step 1: Dropping view...');
    await client.query('DROP VIEW IF EXISTS public.track_rankings CASCADE');
    console.log('✓ View dropped\n');

    console.log('Step 2: Creating new view without SECURITY DEFINER...');
    await client.query(`
      CREATE VIEW public.track_rankings AS
      SELECT 
        t.id, t.user_id, t.title, t.artist_name, t.ai_tool, t.genre, t.music_type, 
        t.prompt, t.external_url, t.play_count, t.created_at, t.last_play_count_at, t.artist_social_url,
        COALESCE(COUNT(l.id), 0) as like_count
      FROM public.tracks t
      LEFT JOIN public.likes l ON t.id = l.track_id
      GROUP BY 
        t.id, t.user_id, t.title, t.artist_name, t.ai_tool, t.genre, t.music_type, 
        t.prompt, t.external_url, t.play_count, t.created_at, t.last_play_count_at, t.artist_social_url
      ORDER BY like_count DESC
    `);
    console.log('✓ View created\n');

    console.log('Step 3: Verifying...');
    const result = await client.query(`
      SELECT definition FROM pg_views WHERE schemaname = 'public' AND viewname = 'track_rankings'
    `);
    
    const definition = result.rows[0]?.definition || '';
    if (definition.includes('SECURITY DEFINER')) {
      console.log('✗ Still has SECURITY DEFINER');
    } else {
      console.log('✓✓✓ SUCCESS! SECURITY DEFINER removed ✓✓✓\n');
      console.log('Next: Go to Supabase Advisors > Refresh');
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixDatabase();
