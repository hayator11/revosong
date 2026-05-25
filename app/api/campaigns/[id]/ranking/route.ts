import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/campaigns/[id]/ranking - Get campaign-specific ranking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get campaign to check dates
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('start_date, end_date')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Fetch all submissions with their scores
    const { data: submissions, error } = await supabase
      .from('campaign_submissions')
      .select(
        `
        id,
        track_id,
        campaign_theme_id,
        submitted_by,
        is_selected_by_theme_author
        `
      )
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        ranking: [],
        total: 0,
      });
    }

    // Fetch campaign likes for each track
    const trackIds = [...new Set(submissions.map((s) => s.track_id))];
    const { data: campaignLikes } = await supabase
      .from('campaign_likes')
      .select('track_id, id')
      .eq('campaign_id', campaignId)
      .in('track_id', trackIds);

    const likesMap: Record<number, number> = {};
    campaignLikes?.forEach((like) => {
      likesMap[like.track_id] = (likesMap[like.track_id] || 0) + 1;
    });

    // Fetch track data for all submissions
    const { data: tracks = [] } = await supabase
      .from('tracks')
      .select('id, title, artist_name, photo_url, external_url, play_count')
      .in('id', trackIds);

    const tracksMap: Record<number, any> = {};
    (tracks || []).forEach((track) => {
      tracksMap[track.id] = track;
    });

    // Fetch profile data for all submitters
    const submitterIds = [...new Set(submissions.map((s) => s.submitted_by))];
    const { data: profiles = [] } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, social_links')
      .in('id', submitterIds);

    const profilesMap: Record<string, any> = {};
    (profiles || []).forEach((profile) => {
      profilesMap[profile.id] = profile;
    });

    // Fetch theme data
    const themeIds = [...new Set(submissions.map((s) => s.campaign_theme_id))];
    const { data: themes = [] } = await supabase
      .from('campaign_themes')
      .select('id, title')
      .in('id', themeIds);

    const themesMap: Record<number, any> = {};
    (themes || []).forEach((theme) => {
      themesMap[theme.id] = theme;
    });

    // Calculate scores and build ranking
    const rankingData = submissions
      .map((submission) => {
        const track = tracksMap[submission.track_id];
        const profile = profilesMap[submission.submitted_by];
        const theme = themesMap[submission.campaign_theme_id];
        return {
          submission_id: submission.id,
          track_id: submission.track_id,
          track_title: track?.title,
          artist_name: track?.artist_name,
          artist_avatar: profile?.avatar_url,
          artist_username: profile?.username,
          artist_social_links: profile?.social_links || {},
          photo_url: track?.photo_url,
          external_url: track?.external_url,
          campaign_likes: likesMap[submission.track_id] || 0,
          campaign_theme_id: submission.campaign_theme_id,
          theme_title: theme?.title,
          is_selected_by_theme_author: submission.is_selected_by_theme_author,
          submitted_by: submission.submitted_by,
          total_score: (likesMap[submission.track_id] || 0) + (track?.play_count || 0),
        };
      })
      .sort((a, b) => b.total_score - a.total_score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    // Group by theme
    const groupedByTheme: Record<number, any> = {};
    rankingData.forEach((item) => {
      const themeId = item.campaign_theme_id;
      if (!groupedByTheme[themeId]) {
        groupedByTheme[themeId] = {
          theme_id: themeId,
          theme_title: item.theme_title,
          ranking: [],
        };
      }
      groupedByTheme[themeId].ranking.push({
        rank: groupedByTheme[themeId].ranking.length + 1,
        submission_id: item.submission_id,
        track_id: item.track_id,
        track_title: item.track_title,
        artist_name: item.artist_name,
        artist_avatar: item.artist_avatar,
        artist_username: item.artist_username,
        artist_social_links: item.artist_social_links,
        photo_url: item.photo_url,
        external_url: item.external_url,
        campaign_likes: item.campaign_likes,
        is_selected_by_theme_author: item.is_selected_by_theme_author,
        submitted_by: item.submitted_by,
        total_score: item.total_score,
      });
    });

    // Apply limit and offset to overall ranking
    const allRanked = rankingData.slice(offset, offset + limit);

    return NextResponse.json({
      ranking: allRanked,
      by_theme: Object.values(groupedByTheme),
      total: rankingData.length,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns/[id]/ranking:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
