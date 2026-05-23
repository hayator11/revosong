const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-northeast-1.db.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres.kxrukjykjwifawdlypfs',
  password: 'onokun0090onokun',
});

async function fixDatabase() {
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('✓ Connected');

    console.log('\nDropping existing view...');
    await client.query('DROP VIEW IF EXISTS public.track_rankings CASCADE;');
    console.log('✓ Dropped view');

    console.log('\nCreating new view (without SECURITY DEFINER)...');
    const createViewSql = `
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
        t.id, t.user_id, t.title, t.artist_name, t.ai_tool, t.genre, t.music_type, 
        t.prompt, t.external_url, t.play_count, t.created_at, t.last_play_count_at, t.artist_social_url
      ORDER BY like_count DESC;
    `;
    await client.query(createViewSql);
    console.log('✓ Created new view');

    console.log('\nVerifying view exists...');
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'track_rankings'
    `);
    if (result.rows.length > 0) {
      console.log('✓ View verified - track_rankings exists');
    }

    console.log('\n✓ All modifications completed successfully!');
    console.log('\nNext step: Open Supabase Security Advisor and refresh to confirm errors are resolved.');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixDatabase();
