import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { parseTrackUrl } from '@/lib/track-url-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AddPlaylistItemRequest {
  external_url?: string;
  external_title?: string;
  external_artist?: string;
  external_thumbnail_url?: string;
  external_service?: string;
  music_type?: string;
}

// POST /api/playlists/[id]/items - Add item to playlist
export async function POST(
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
    const body: AddPlaylistItemRequest = await request.json();

    if ('track_id' in body) {
      return NextResponse.json(
        { error: '現在登録できるのは YouTube と SoundCloud のURLのみです。' },
        { status: 400 }
      );
    }

    // Validate input - must have external_url
    if (!body.external_url) {
      return NextResponse.json(
        { error: 'URLを入力してください。' },
        { status: 400 }
      );
    }

    // For external URLs, validate service and metadata
    if (body.external_url) {
      if (!body.external_service) {
        return NextResponse.json(
          { error: 'external_service is required for external URLs' },
          { status: 400 }
        );
      }

      const parsedUrl = parseTrackUrl(body.external_url);
      if (!parsedUrl || body.external_service !== parsedUrl.provider) {
        return NextResponse.json(
          { error: '現在登録できるのは YouTube と SoundCloud のURLのみです。' },
          { status: 400 }
        );
      }

      if (!body.external_title) {
        return NextResponse.json(
          { error: 'external_title is required for external URLs' },
          { status: 400 }
        );
      }

      const duplicateQuery = supabase
        .from('playlist_items')
        .select('id, external_url')
        .eq('playlist_id', playlistId)
        .eq('external_service', parsedUrl.provider);

      const { data: existingItems } = await duplicateQuery;
      const duplicate = (existingItems || []).some((item) => {
        if (parsedUrl.provider === 'youtube') {
          return parseTrackUrl(item.external_url || '')?.providerTrackId === parsedUrl.providerTrackId;
        }
        return (item.external_url || '').trim() === parsedUrl.originalUrl;
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'この曲はすでにプレイリストに入っています。' },
          { status: 400 }
        );
      }
    }

    // Get the next order_index
    const { data: maxItem } = await supabase
      .from('playlist_items')
      .select('order_index')
      .eq('playlist_id', playlistId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxItem ? maxItem.order_index + 1 : 0;

    // Create the item
    const itemData: any = {
      playlist_id: playlistId,
      order_index: nextOrder,
      music_type: body.music_type || 'audio'
    };

    itemData.external_url = body.external_url;
    itemData.external_title = body.external_title;
    itemData.external_artist = body.external_artist || null;
    itemData.external_thumbnail_url = body.external_thumbnail_url || null;
    itemData.external_service = body.external_service;

    const { data: item, error: insertError } = await supabase
      .from('playlist_items')
      .insert(itemData)
      .select()
      .single();

    if (insertError) {
      console.error('Error adding playlist item:', insertError);

      // Check if it's a duplicate item error
      if (insertError.message.includes('Duplicate') || insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This item is already in the playlist' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to add item to playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Add playlist item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
