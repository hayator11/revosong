import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdateItemRequest {
  external_title?: string;
  external_artist?: string;
  music_type?: string;
}

// PATCH /api/playlists/[id]/items/[itemId] - Update item metadata
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> }
) {
  const params = await context.params;
  try {
    const playlistId = parseInt(params.id);
    const itemId = parseInt(params.itemId);

    if (isNaN(playlistId) || isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID or item ID' },
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
    const { data: item, error: itemError } = await supabase
      .from('playlist_items')
      .select('pi:*, p:playlists(user_id)')
      .eq('id', itemId)
      .eq('playlist_id', playlistId)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // For safety, fetch playlist separately to verify ownership
    const { data: playlist } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (!playlist || playlist.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: UpdateItemRequest = await request.json();

    // Validate input
    if (body.music_type && !['audio', 'video'].includes(body.music_type)) {
      return NextResponse.json(
        { error: 'music_type must be "audio" or "video"' },
        { status: 400 }
      );
    }

    if (body.external_title && (typeof body.external_title !== 'string' || body.external_title.length > 255)) {
      return NextResponse.json(
        { error: 'external_title must be a string <= 255 characters' },
        { status: 400 }
      );
    }

    if (body.external_artist && (typeof body.external_artist !== 'string' || body.external_artist.length > 255)) {
      return NextResponse.json(
        { error: 'external_artist must be a string <= 255 characters' },
        { status: 400 }
      );
    }

    // Update item
    const updateData: any = {};
    if (body.external_title !== undefined) updateData.external_title = body.external_title;
    if (body.external_artist !== undefined) updateData.external_artist = body.external_artist;
    if (body.music_type !== undefined) updateData.music_type = body.music_type;

    const { data: updated, error: updateError } = await supabase
      .from('playlist_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating item:', updateError);
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/playlists/[id]/items/[itemId] - Remove item from playlist
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> }
) {
  const params = await context.params;
  try {
    const playlistId = parseInt(params.id);
    const itemId = parseInt(params.itemId);

    if (isNaN(playlistId) || isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID or item ID' },
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
    const { data: playlist } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (!playlist || playlist.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Verify item belongs to playlist
    const { data: item, error: itemError } = await supabase
      .from('playlist_items')
      .select('id')
      .eq('id', itemId)
      .eq('playlist_id', playlistId)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Delete item
    const { error: deleteError } = await supabase
      .from('playlist_items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      console.error('Error deleting item:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
