import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'admin';
}

// GET /api/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // 'active', 'past', 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('campaigns')
      .select(
        `
        *,
        theme:campaign_themes(id, title, submitted_by)
        `,
        { count: 'exact' }
      );

    // Filter by status
    const now = new Date().toISOString();
    if (status === 'active') {
      query = query
        .lt('start_date', now)
        .gt('end_date', now)
        .eq('is_active', true);
    } else if (status === 'past') {
      query = query.lt('end_date', now);
    }

    const { data: campaigns, error, count } = await query
      .order('start_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching campaigns:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to fetch campaigns',
          details: error.message || error,
          code: error.code
        },
        { status: 500 }
      );
    }

    // Enrich campaigns with calculated fields
    const enrichedCampaigns = await Promise.all(
      (campaigns || []).map(async (campaign: any) => {
        const now = new Date();
        const start = new Date(campaign.start_date);
        const end = new Date(campaign.end_date);

        // Calculate status
        let status = '終了';
        if (now < start) {
          status = '募集予定';
        } else if (now >= start && now <= end) {
          status = '投票受付中';
        }

        // Get theme proposer name
        const proposer_name = campaign.theme?.submitted_by
          ? `@${campaign.theme.submitted_by.split('-')[0]}`
          : '不明';

        // Count participants and submissions
        const { data: submissions } = await supabase
          .from('campaign_submissions')
          .select('submitted_by, track_id', { count: 'exact' })
          .eq('campaign_id', campaign.id);

        const uniqueParticipants = new Set(
          (submissions || []).map((s: any) => s.submitted_by)
        );

        return {
          ...campaign,
          status,
          proposer_name,
          participant_count: uniqueParticipants.size,
          submission_count: submissions?.length || 0,
        };
      })
    );

    return NextResponse.json({
      campaigns: enrichedCampaigns,
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create new campaign (admin only)
export async function POST(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminCheck = await isAdmin(session.user.id);
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      theme_id,
      title,
      description,
      theme_image_url,
      start_date,
      end_date,
      submission_start,
      submission_end,
    } = body;

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Campaign title is required' },
        { status: 400 }
      );
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Create campaign
    const { data: newCampaign, error } = await supabase
      .from('campaigns')
      .insert({
        created_by: session.user.id,
        theme_id: theme_id || null,
        title: title.trim(),
        description: description?.trim() || null,
        theme_image_url: theme_image_url || null,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        submission_start: submission_start ? new Date(submission_start).toISOString() : null,
        submission_end: submission_end ? new Date(submission_end).toISOString() : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST campaigns:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
