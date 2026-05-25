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

// GET /api/campaigns/[id] - Get single campaign with submissions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = parseInt(id);

    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Calculate status
    const now = new Date();
    const start = new Date(campaign.start_date);
    const end = new Date(campaign.end_date);
    let status = '終了';
    if (now < start) {
      status = '募集予定';
    } else if (now >= start && now <= end) {
      status = '投票受付中';
    }

    // Fetch submissions and count
    const { data: submissions } = await supabase
      .from('campaign_submissions')
      .select('submitted_by, track_id', { count: 'exact' })
      .eq('campaign_id', campaignId);

    const uniqueParticipants = new Set(
      (submissions || []).map((s: any) => s.submitted_by)
    );

    // Get theme proposer name
    const proposer_name = campaign.theme_id
      ? (() => {
          // We'll need to fetch theme separately
          return '@unknown'; // Placeholder
        })()
      : '@unknown';

    const enrichedCampaign = {
      ...campaign,
      status,
      proposer_name,
      proposer_message: campaign.theme_id
        ? 'テーマ提案者からのメッセージ'
        : 'メッセージなし',
      participant_count: uniqueParticipants.size,
      submission_count: submissions?.length || 0,
    };

    return NextResponse.json({
      campaign: enrichedCampaign,
    });
  } catch (err) {
    console.error('Unexpected error in GET campaigns/[id]:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// PATCH /api/campaigns/[id] - Update campaign (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const campaignId = parseInt(id);
    const body = await request.json();

    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update(body)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCampaign);
  } catch (err) {
    console.error('Unexpected error in PATCH campaigns/[id]:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete campaign (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const campaignId = parseInt(id);

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      console.error('Error deleting campaign:', error);
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE campaigns/[id]:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
