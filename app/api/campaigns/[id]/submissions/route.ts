import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/campaigns/[id]/submissions - Get submissions grouped by theme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    // Fetch campaign to check dates
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, end_date')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Fetch all submissions with related data
    const { data: submissions, error } = await supabase
      .from('campaign_submissions')
      .select(
        `
        id,
        campaign_theme_id,
        track_id,
        submitted_by,
        submitted_at,
        is_selected_by_theme_author,
        theme:campaign_themes(id, title),
        track:tracks(id, title, artist_name, photo_url, external_url),
        submitter:profiles(username, avatar_url)
        `
      )
      .eq('campaign_id', campaignId)
      .order('campaign_theme_id', { ascending: true })
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    // Group by theme
    const groupedByTheme: Record<number, any> = {};
    submissions?.forEach((submission) => {
      const themeId = submission.campaign_theme_id;
      if (!groupedByTheme[themeId]) {
        groupedByTheme[themeId] = {
          theme_id: themeId,
          theme_title: submission.theme?.title,
          submissions: [],
        };
      }
      groupedByTheme[themeId].submissions.push(submission);
    });

    const campaignEnded = new Date(campaign.end_date) < new Date();

    return NextResponse.json({
      themes: Object.values(groupedByTheme),
      campaignEnded,
      submissionCount: submissions?.length || 0,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns/[id]/submissions:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns/[id]/submissions - Submit track to campaign
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const campaignId = parseInt(params.id);
    const body = await request.json();
    const { campaign_theme_id, track_id } = body;

    // Validation
    if (!campaign_theme_id || !track_id) {
      return NextResponse.json(
        { error: 'Theme ID and track ID are required' },
        { status: 400 }
      );
    }

    // Check if campaign exists and submission period is active
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('submission_start, submission_end, end_date')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const submissionStart = campaign.submission_start ? new Date(campaign.submission_start) : null;
    const submissionEnd = campaign.submission_end ? new Date(campaign.submission_end) : new Date(campaign.end_date);

    if (submissionStart && now < submissionStart) {
      return NextResponse.json(
        { error: 'Submission period has not started yet' },
        { status: 400 }
      );
    }

    if (now > submissionEnd) {
      return NextResponse.json(
        { error: 'Submission period has ended' },
        { status: 400 }
      );
    }

    // Check if theme exists
    const { data: theme, error: themeError } = await supabase
      .from('campaign_themes')
      .select('id')
      .eq('id', campaign_theme_id)
      .eq('campaign_id', campaignId)
      .single();

    if (themeError || !theme) {
      return NextResponse.json(
        { error: 'Theme not found in this campaign' },
        { status: 404 }
      );
    }

    // Check if track exists
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('id')
      .eq('id', track_id)
      .single();

    if (trackError || !track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    // Check if already submitted (unique constraint will handle this too)
    const { data: existing } = await supabase
      .from('campaign_submissions')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('campaign_theme_id', campaign_theme_id)
      .eq('track_id', track_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Track already submitted to this theme' },
        { status: 409 }
      );
    }

    // Create submission
    const { data: submission, error } = await supabase
      .from('campaign_submissions')
      .insert({
        campaign_id: campaignId,
        campaign_theme_id,
        track_id,
        submitted_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission:', error);
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST campaigns/[id]/submissions:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
