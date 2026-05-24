import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdatePlaylistRequest {
  title?: string;
  description?: string;
  cover_image_url?: string;
  is_public?: boolean;
}

interface PlaylistWithItems {
  playlist: {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    is_public: boolean;
    play_count: number;
    created_at: string;
    updated_at: string;
  };
  items: any[];
}

// GET /api/playlists/[id] - Get playlist with all items
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const playlistId = parseInt(params.id);
    if (isNaN(playlistId)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID' },
        { status: 400 }
      );
    }

    // Get current user (for authorization check)
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Fetch playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single();

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check authorization (owner or public)
    if (playlist.is_public === false && playlist.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch playlist items with track details
    const { data: items, error: itemsError } = await supabase
      .from('playlist_items_with_details')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('order_index', { ascending: true });

    if (itemsError) {
      console.error('Error fetching playlist items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch playlist items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      playlist,
      items: items || []
    } as PlaylistWithItems);
  } catch (error) {
    console.error('Playlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/playlists/[id] - Update playlist metadata
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const playlistId = parseInt(params.id);
    if (isNaN(playlistId)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID' },
        { status: 400 }
      );
    }

    // Get current user
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

    // Check if user owns the playlist
    const { data: playlist, error: fetchError } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (fetchError || !playlist || playlist.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized or playlist not found' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: UpdatePlaylistRequest = await request.json();

    // Validate input
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.length === 0 || body.title.length > 255)) {
      return NextResponse.json(
        { error: 'Title must be between 1 and 255 characters' },
        { status: 400 }
      );
    }

    if (body.description !== undefined && (body.description && body.description.length > 1000)) {
      return NextResponse.json(
        { error: 'Description must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Update playlist
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;

    const { data: updated, error: updateError } = await supabase
      .from('playlists')
      .update(updateData)
      .eq('id', playlistId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating playlist:', updateError);
      return NextResponse.json(
        { error: 'Failed to update playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Playlist PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/playlists/[id] - Delete playlist
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const playlistId = parseInt(params.id);
    if (isNaN(playlistId)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID' },
        { status: 400 }
      );
    }

    // Get current user
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

    // Check if user owns the playlist
    const { data: playlist, error: fetchError } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (fetchError || !playlist || playlist.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized or playlist not found' },
        { status: 403 }
      );
    }

    // Delete playlist (cascades to items)
    const { error: deleteError } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    if (deleteError) {
      console.error('Error deleting playlist:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Playlist DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
