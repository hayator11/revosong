import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ReorderRequest {
  items: Array<{
    id: number;
    order_index: number;
  }>;
}

// PATCH /api/playlists/[id]/items/reorder - Reorder items in a playlist
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
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('id')
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single();

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: 'Playlist not found or unauthorized' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: ReorderRequest = await request.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of body.items) {
      if (typeof item.id !== 'number' || typeof item.order_index !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have id and order_index as numbers' },
          { status: 400 }
        );
      }

      if (item.order_index < 0) {
        return NextResponse.json(
          { error: 'order_index must be >= 0' },
          { status: 400 }
        );
      }
    }

    // Update all items in a transaction
    const updates = body.items.map(item =>
      supabase
        .from('playlist_items')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
        .eq('playlist_id', playlistId)
    );

    // Execute all updates
    const results = await Promise.all(updates);

    // Check for errors
    for (const result of results) {
      if (result.error) {
        console.error('Error updating order_index:', result.error);
        return NextResponse.json(
          { error: 'Failed to reorder items' },
          { status: 500 }
        );
      }
    }

    // Fetch and return updated items
    const { data: items, error: fetchError } = await supabase
      .from('playlist_items')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('order_index', { ascending: true });

    if (fetchError) {
      console.error('Error fetching updated items:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch updated items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Reorder items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
