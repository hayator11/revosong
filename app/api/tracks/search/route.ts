import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TrackSearchResult {
  id: number;
  title: string;
  artist_name: string;
  ai_tool: string;
  genre: string;
  music_type: string;
  external_url: string | null;
  play_count: number;
  photo_url: string | null;
}

// GET /api/tracks/search - REVOSONG楽曲を検索
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    if (!query.trim()) {
      return NextResponse.json({
        tracks: [],
        total: 0
      });
    }

    // タイトルとアーティスト名で検索
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`title.ilike.%${query}%,artist_name.ilike.%${query}%`)
      .order('play_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      tracks: (tracks as TrackSearchResult[]) || [],
      total: tracks?.length || 0
    });
  } catch (error) {
    console.error('Track search error:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
