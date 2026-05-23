const SUPABASE_URL = "https://kxrukjykjwifawdlypfs.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cnVranlrandpZmF3ZGx5cGZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM1NzQwNywiZXhwIjoyMDk0OTMzNDA3fQ.xAqGsE9Y3Q8-q-sR1e0A9sY8xY5Z9U7V3K0A0J0B0L0";

async function fixDatabase() {
  try {
    console.log('Attempting to fix Supabase database via REST API...');
    
    // First SQL: Drop view
    const drop_sql = "DROP VIEW IF EXISTS public.track_rankings CASCADE;";
    
    // Second SQL: Create view without SECURITY DEFINER
    const create_sql = `
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

    console.log('✗ Unable to execute SQL via API without proper credentials.');
    console.log('\nPlease execute the following SQL in Supabase SQL Editor:');
    console.log('\n=== Step 1: Drop existing view ===');
    console.log(drop_sql);
    console.log('\n=== Step 2: Create new view ===');
    console.log(create_sql);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixDatabase();
