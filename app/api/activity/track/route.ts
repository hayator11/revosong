import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TrackActivityRequest {
  type: 'page_view' | 'api_call' | 'user_action';
  endpoint?: string;
  method?: string;
  status_code?: number;
  response_time_ms?: number;
  page_path?: string;
}

// POST /api/activity/track - アクティビティを記録
export async function POST(request: NextRequest) {
  try {
    // ユーザー認証
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!userId) {
      // 認証なしでもアクセス可（匿名ユーザーの追跡も可能）
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // リクエスト情報取得
    const clientIp = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // リクエストボディ解析
    const body: TrackActivityRequest = await request.json();

    // last_activity を更新
    await supabase
      .from('profiles')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', userId);

    // アクティビティタイプに応じた処理
    if (body.type === 'api_call' && body.endpoint && body.method) {
      // APIコール記録
      await supabase
        .from('access_logs')
        .insert({
          user_id: userId,
          endpoint: body.endpoint,
          method: body.method,
          status_code: body.status_code,
          response_time_ms: body.response_time_ms,
          ip_address: clientIp,
          user_agent: userAgent
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
