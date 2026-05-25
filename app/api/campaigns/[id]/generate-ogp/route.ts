import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/campaigns/[id]/generate-ogp - Generate OGP image for campaign award
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const campaignId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { submission_id } = body;

    if (!submission_id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch campaign and award data
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, title, awarded_submission_id, theme_proposer_comment, theme_id')
      .eq('id', campaignId)
      .single();

    if (!campaign || campaign.awarded_submission_id !== submission_id) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      );
    }

    // Fetch theme data
    const { data: theme } = await supabase
      .from('campaign_themes')
      .select('id, title, submitted_by')
      .eq('id', campaign.theme_id)
      .single();

    // Fetch submission and track data
    const { data: submission } = await supabase
      .from('campaign_submissions')
      .select('track_id')
      .eq('id', submission_id)
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Fetch track data
    const { data: track } = await supabase
      .from('tracks')
      .select('title, artist_name, photo_url, external_url')
      .eq('id', submission.track_id)
      .single();

    // Generate OGP image URL
    // In production, this would use sharp or canvas to generate an actual image
    // For now, we'll create a structured image placeholder that can be used with a service
    const ogpFileName = `campaign-${campaignId}-award.png`;
    const ogpPath = `/public/ogp/campaigns/${ogpFileName}`;
    const ogpUrl = `/api/og/campaigns/${campaignId}`;

    // Store OGP URL in campaign
    const { error } = await supabase
      .from('campaigns')
      .update({
        ogp_image_url: ogpUrl,
      })
      .eq('id', campaignId);

    if (error) {
      console.error('Error saving OGP URL:', error);
      // Don't fail completely if saving fails, continue
    }

    return NextResponse.json({
      ogp_image_url: ogpUrl,
      ogp_filename: ogpFileName,
      ogp_data: {
        campaign_title: campaign.title,
        campaign_id: campaignId,
        theme_title: theme?.title,
        theme_proposer: theme?.submitted_by,
        track_title: track?.title,
        artist_name: track?.artist_name,
        thumbnail_url: track?.photo_url,
        comment: campaign.theme_proposer_comment,
      },
    });
  } catch (err) {
    console.error('Unexpected error in POST campaigns/[id]/generate-ogp:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
