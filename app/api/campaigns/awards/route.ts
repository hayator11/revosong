import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/campaigns/awards - Get all campaigns with awards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const year = searchParams.get('year'); // Optional filter by year
    const proposerId = searchParams.get('proposerId'); // Optional filter by proposer

    // Fetch campaigns with awards and all related data
    let query = supabase
      .from('campaigns')
      .select(
        `
        id,
        title,
        description,
        start_date,
        end_date,
        awarded_submission_id,
        awarded_at,
        theme_proposer_comment,
        ogp_image_url,
        theme:campaign_themes(
          id,
          title,
          submitted_by
        )
        `,
        { count: 'exact' }
      )
      .not('awarded_submission_id', 'is', null) // Only campaigns with awards
      .order('awarded_at', { ascending: false });

    // Apply filters
    if (year) {
      const startOfYear = `${year}-01-01T00:00:00Z`;
      const endOfYear = `${year}-12-31T23:59:59Z`;
      query = query
        .gte('awarded_at', startOfYear)
        .lte('awarded_at', endOfYear);
    }

    const { data: campaigns, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching award campaigns:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to fetch award campaigns',
          details: error.message || error,
          code: error.code
        },
        { status: 500 }
      );
    }

    // Fetch additional details for each campaign (submission and track)
    const enrichedAwards = await Promise.all(
      (campaigns || []).map(async (campaign: any) => {
        const theme = campaign.theme?.[0];

        // Fetch awarded submission and track details
        const { data: submission } = await supabase
          .from('campaign_submissions')
          .select(
            `
            id,
            track_id,
            submitted_by,
            track:tracks(id, title, artist_name, photo_url, external_url),
            submitter:profiles(id, username, avatar_url)
            `
          )
          .eq('id', campaign.awarded_submission_id)
          .single();

        const track = submission?.track?.[0];
        const proposer = submission?.submitter?.[0];

        // Apply proposerId filter after data is fetched
        if (proposerId && theme?.submitted_by !== proposerId) {
          return null;
        }

        return {
          id: campaign.id,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          campaignDescription: campaign.description,
          themeTitle: theme?.title,
          themeProposeId: theme?.submitted_by,
          awardedDate: campaign.awarded_at,
          trackTitle: track?.title,
          artistName: track?.artist_name,
          proposerName: proposer?.username || theme?.submitted_by?.substring(0, 8) || 'Anonymous',
          proposerAvatar: proposer?.avatar_url,
          proposerComment: campaign.theme_proposer_comment,
          thumbnailUrl: track?.photo_url || track?.external_url,
          ogpImageUrl: campaign.ogp_image_url,
        };
      })
    );

    // Filter out null entries (filtered by proposerId)
    const filteredAwards = enrichedAwards.filter((award) => award !== null);

    return NextResponse.json({
      awards: filteredAwards,
      total: filteredAwards.length,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns/awards:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
