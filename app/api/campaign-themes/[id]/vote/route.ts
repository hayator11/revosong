import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/campaign-themes/[id]/vote - Vote on a campaign theme
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const id = parseInt(resolvedParams.id);

    // Get the current theme
    const { data: theme, error: fetchError } = await supabase
      .from('campaign_themes')
      .select('votes_count')
      .eq('id', id)
      .single();

    if (fetchError || !theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Increment vote count
    const { data: updatedTheme, error } = await supabase
      .from('campaign_themes')
      .update({ votes_count: (theme.votes_count || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error voting on theme:', error);
      return NextResponse.json(
        { error: 'Failed to vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedTheme.id,
      votes_count: updatedTheme.votes_count,
    });
  } catch (err) {
    console.error('Unexpected error in POST campaign-themes/[id]/vote:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
