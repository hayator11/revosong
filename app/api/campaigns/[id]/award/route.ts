import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to get campaign theme proposer
async function getThemeProposer(campaignId: number): Promise<string | null> {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('theme_id')
    .eq('id', campaignId)
    .single();

  if (!campaign?.theme_id) return null;

  const { data: theme } = await supabase
    .from('campaign_themes')
    .select('submitted_by')
    .eq('id', campaign.theme_id)
    .single();

  return theme?.submitted_by || null;
}

// GET /api/campaigns/[id]/award - Get award selection for campaign
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const campaignId = parseInt(resolvedParams.id);

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('awarded_submission_id, awarded_at, theme_proposer_comment, ogp_image_url')
      .eq('id', campaignId)
      .single();

    if (error || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.awarded_submission_id) {
      return NextResponse.json(
        { award: null },
        { status: 200 }
      );
    }

    // Fetch award details
    const { data: award } = await supabase
      .from('campaign_submissions')
      .select(
        `
        id,
        track_id,
        submitted_by,
        track:tracks(id, title, artist_name, photo_url, external_url),
        submitter:profiles(username, avatar_url)
        `
      )
      .eq('id', campaign.awarded_submission_id)
      .single();

    return NextResponse.json({
      awarded_submission_id: campaign.awarded_submission_id,
      awarded_at: campaign.awarded_at,
      theme_proposer_comment: campaign.theme_proposer_comment,
      ogp_image_url: campaign.ogp_image_url,
      award,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns/[id]/award:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns/[id]/award - Theme proposer selects favorite submission
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

    const campaignId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { submission_id, theme_proposer_comment } = body;

    if (!submission_id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Check if user is the theme proposer
    const proposer = await getThemeProposer(campaignId);
    if (proposer !== session.user.id) {
      return NextResponse.json(
        { error: 'Only theme proposer can select award' },
        { status: 403 }
      );
    }

    // Verify campaign has ended
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('end_date, awarded_submission_id')
      .eq('id', campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (new Date(campaign.end_date) > new Date()) {
      return NextResponse.json(
        { error: 'Campaign has not ended yet' },
        { status: 400 }
      );
    }

    if (campaign.awarded_submission_id) {
      return NextResponse.json(
        { error: 'Award has already been selected for this campaign' },
        { status: 409 }
      );
    }

    // Verify submission exists and belongs to this campaign
    const { data: submission } = await supabase
      .from('campaign_submissions')
      .select('id, campaign_id')
      .eq('id', submission_id)
      .single();

    if (!submission || submission.campaign_id !== campaignId) {
      return NextResponse.json(
        { error: 'Submission not found or does not belong to this campaign' },
        { status: 404 }
      );
    }

    // Update campaign with award selection
    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update({
        awarded_submission_id: submission_id,
        awarded_at: new Date().toISOString(),
        theme_proposer_comment: theme_proposer_comment || '',
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      console.error('Error selecting award:', error);
      return NextResponse.json(
        { error: 'Failed to select award' },
        { status: 500 }
      );
    }

    // Mark submission as selected by theme author
    await supabase
      .from('campaign_submissions')
      .update({ is_selected_by_theme_author: true })
      .eq('id', submission_id);

    // Trigger OGP image generation
    try {
      await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/campaigns/${campaignId}/generate-ogp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id, campaign_id: campaignId }),
      });
    } catch (ogpErr) {
      console.error('Warning: OGP generation failed:', ogpErr);
      // Don't fail the award selection if OGP generation fails
    }

    return NextResponse.json(updatedCampaign, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST campaigns/[id]/award:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// PATCH /api/campaigns/[id]/award - Update theme proposer's comment
export async function PATCH(
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

    const campaignId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { theme_proposer_comment } = body;

    if (theme_proposer_comment === undefined) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    // Check if user is the theme proposer
    const proposer = await getThemeProposer(campaignId);
    if (proposer !== session.user.id) {
      return NextResponse.json(
        { error: 'Only theme proposer can update comment' },
        { status: 403 }
      );
    }

    // Update comment
    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update({
        theme_proposer_comment: theme_proposer_comment,
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return NextResponse.json(
        { error: 'Failed to update comment' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCampaign);
  } catch (err) {
    console.error('Unexpected error in PATCH campaigns/[id]/award:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
