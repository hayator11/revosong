import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PATCH /api/admin/recruitment/[id] - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved, rejected, or pending' },
        { status: 400 }
      );
    }

    const themeId = parseInt(resolvedParams.id);
    if (isNaN(themeId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Update theme status using admin client
    // Note: RLS is handled at the database level, this uses service role
    const { data: updatedTheme, error } = await supabaseAdmin
      .from('campaign_themes')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', themeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating theme status:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update theme status' },
        { status: 500 }
      );
    }

    if (!updatedTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTheme);
  } catch (err) {
    console.error('Unexpected error in PATCH recruitment:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/recruitment/[id] - Get specific application details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const themeId = parseInt(resolvedParams.id);
    if (isNaN(themeId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Get theme
    const { data: theme, error } = await supabaseAdmin
      .from('campaign_themes')
      .select('*')
      .eq('id', themeId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (err) {
    console.error('Unexpected error in GET recruitment details:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}
