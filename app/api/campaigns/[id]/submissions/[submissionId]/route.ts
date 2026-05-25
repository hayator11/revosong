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

// DELETE /api/campaigns/[id]/submissions/[submissionId] - Delete submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; submissionId: string } }
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const submissionId = parseInt(params.submissionId);

    // Get submission to check ownership
    const { data: submission, error: submitError } = await supabase
      .from('campaign_submissions')
      .select('submitted_by')
      .eq('id', submissionId)
      .single();

    if (submitError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    const isOwner = submission.submitted_by === session.user.id;
    const adminCheck = await isAdmin(session.user.id);

    if (!isOwner && !adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete submission
    const { error } = await supabase
      .from('campaign_submissions')
      .delete()
      .eq('id', submissionId);

    if (error) {
      console.error('Error deleting submission:', error);
      return NextResponse.json(
        { error: 'Failed to delete submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE campaigns/[id]/submissions/[submissionId]:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
