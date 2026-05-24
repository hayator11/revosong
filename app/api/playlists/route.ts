import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreatePlaylistRequest {
  title: string;
  description?: string;
  is_public?: boolean;
}

interface PlaylistResponse {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  play_count: number;
  created_at: string;
  updated_at: string;
}

// GET /api/playlists - List user's playlists
export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'updated_at';

    // Validate sort parameter (prevent SQL injection)
    const validSortFields = ['created_at', 'updated_at', 'title', 'play_count'];
    const sortField = validSortFields.includes(sort) ? sort : 'updated_at';

    // Fetch user's playlists
    const { data: playlists, error: fetchError, count } = await supabase
      .from('playlists')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order(sortField, { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error('Error fetching playlists:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch playlists' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      playlists: playlists || [],
      total: count || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error('Playlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/playlists - Create new playlist
export async function POST(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreatePlaylistRequest = await request.json();

    // Validate input
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    if (body.title.length === 0 || body.title.length > 255) {
      return NextResponse.json(
        { error: 'Title must be between 1 and 255 characters' },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Create playlist
    const { data: playlist, error: createError } = await supabase
      .from('playlists')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description || null,
        is_public: body.is_public || false
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating playlist:', createError);
      return NextResponse.json(
        { error: 'Failed to create playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(playlist as PlaylistResponse, { status: 201 });
  } catch (error) {
    console.error('Playlist POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
