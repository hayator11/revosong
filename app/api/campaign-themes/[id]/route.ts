import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/campaign-themes/[id] - Get single theme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const { data: theme, error } = await supabase
      .from('campaign_themes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Fetch submitter info
    const { data: submitterProfile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', theme.submitted_by)
      .single();

    return NextResponse.json({
      ...theme,
      submitter: submitterProfile,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaign-themes/[id]:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
