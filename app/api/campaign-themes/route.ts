import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/campaign-themes - List pending and approved themes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch themes with vote count
    const { data: themes, error, count } = await supabase
      .from('campaign_themes')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('votes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching campaign themes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch campaign themes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      themes,
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaign-themes:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// POST /api/campaign-themes - Submit new campaign theme
export async function POST(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description } = body;

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Theme title is required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Theme title must be 200 characters or less' },
        { status: 400 }
      );
    }

    // Create new campaign theme
    const { data: newTheme, error } = await supabase
      .from('campaign_themes')
      .insert({
        submitted_by: session.user.id,
        title: title.trim(),
        description: description?.trim() || null,
        status: 'pending',
        votes_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign theme:', error);
      return NextResponse.json(
        { error: 'Failed to create campaign theme' },
        { status: 500 }
      );
    }

    // Fetch submitter info
    const { data: submitterProfile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json(
      {
        id: newTheme.id,
        title: newTheme.title,
        description: newTheme.description,
        submitted_by: session.user.id,
        submitter: submitterProfile,
        votes_count: 0,
        created_at: newTheme.created_at,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error in POST campaign-themes:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
