import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',');

interface ExtendedStats {
  usage: {
    avg_daily_usage_minutes: number;
    median_daily_usage_minutes: number;
    max_daily_usage_minutes: number;
    total_session_minutes_last_30days: number;
  };
  access: {
    total_requests_today: number;
    total_requests_last_7days: number;
    total_requests_last_30days: number;
    avg_response_time_ms: number;
    unique_users_today: number;
    unique_users_last_7days: number;
    unique_users_last_30days: number;
  };
  active_users: {
    currently_active: number;
    very_active_1min: number;
    idle_but_online: number;
    online_today: number;
  };
  daily_trend: Array<{
    date: string;
    active_users: number;
    total_requests: number;
    avg_duration_minutes: number;
    avg_response_time_ms: number;
  }>;
  endpoint_stats: Array<{
    endpoint: string;
    method: string;
    request_count: number;
    avg_response_time_ms: number;
    unique_users: number;
    error_rate_percent: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // 管理者認証
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // ========== 使用時間統計 ==========

    // 日別のセッション統計を取得
    const { data: dailySessionStats } = await supabase
      .rpc('get_session_stats', { days: 30 });

    let avgDailyUsage = 0;
    let medianDailyUsage = 0;
    let maxDailyUsage = 0;
    let totalSessionMinutes = 0;

    if (dailySessionStats && Array.isArray(dailySessionStats)) {
      const durations = dailySessionStats
        .map(s => s.avg_duration_minutes as number)
        .filter(d => d !== null && d !== undefined);

      if (durations.length > 0) {
        avgDailyUsage = durations.reduce((a, b) => a + b, 0) / durations.length;
        durations.sort((a, b) => a - b);
        medianDailyUsage = durations[Math.floor(durations.length / 2)];
        maxDailyUsage = Math.max(...durations);
      }

      totalSessionMinutes = dailySessionStats.reduce(
        (sum, s) => sum + (s.total_duration_minutes as number || 0),
        0
      );
    }

    // ========== アクセス統計 ==========

    // 本日のアクセス
    const { data: accessToday } = await supabase
      .from('access_logs')
      .select('id, user_id', { count: 'exact' })
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { data: accessLast7 } = await supabase
      .from('access_logs')
      .select('id, user_id', { count: 'exact' })
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const { data: accessLast30 } = await supabase
      .from('access_logs')
      .select('id, user_id', { count: 'exact' })
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // ユニークユーザー数
    const uniqueUsersToday = accessToday
      ? new Set((accessToday as any[]).map(a => a.user_id)).size
      : 0;
    const uniqueUsersLast7 = accessLast7
      ? new Set((accessLast7 as any[]).map(a => a.user_id)).size
      : 0;
    const uniqueUsersLast30 = accessLast30
      ? new Set((accessLast30 as any[]).map(a => a.user_id)).size
      : 0;

    // 平均レスポンスタイム
    const { data: responseTimeData } = await supabase
      .from('access_logs')
      .select('response_time_ms')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const avgResponseTime = responseTimeData && Array.isArray(responseTimeData)
      ? responseTimeData
          .filter(r => r.response_time_ms !== null)
          .reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / responseTimeData.length
      : 0;

    // ========== 現在のアクティブユーザー ==========

    const { data: currentActive } = await supabase
      .rpc('get_active_users_count', { minutes_threshold: 5 });

    const activeData = Array.isArray(currentActive) ? currentActive[0] : currentActive;

    // ========== 日別トレンド（過去7日） ==========

    const { data: trendData } = await supabase
      .rpc('get_session_stats', { days: 7 });

    const dailyTrend = trendData && Array.isArray(trendData)
      ? trendData.map(d => ({
          date: d.date as string,
          active_users: (d.unique_users as number) || 0,
          total_requests: 0, // 後で取得
          avg_duration_minutes: parseFloat(d.avg_duration_minutes as unknown as string) || 0,
          avg_response_time_ms: 0 // 後で取得
        }))
      : [];

    // アクセスログから日別データを取得
    const { data: accessTrendData } = await supabase
      .from('access_logs')
      .select('timestamp, response_time_ms')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (accessTrendData && Array.isArray(accessTrendData)) {
      const accessByDate: Record<string, { count: number; totalTime: number }> = {};

      accessTrendData.forEach(log => {
        const date = new Date(log.timestamp).toISOString().split('T')[0];
        if (!accessByDate[date]) {
          accessByDate[date] = { count: 0, totalTime: 0 };
        }
        accessByDate[date].count++;
        accessByDate[date].totalTime += log.response_time_ms || 0;
      });

      dailyTrend.forEach(trend => {
        const data = accessByDate[trend.date];
        if (data) {
          trend.total_requests = data.count;
          trend.avg_response_time_ms = Math.round(data.totalTime / data.count);
        }
      });
    }

    // ========== エンドポイント統計 ==========

    const { data: endpointStats } = await supabase
      .from('access_logs')
      .select('endpoint, method, status_code, response_time_ms, user_id')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const endpointMap: Record<string, any> = {};

    if (endpointStats && Array.isArray(endpointStats)) {
      endpointStats.forEach(log => {
        const key = `${log.endpoint}|${log.method}`;
        if (!endpointMap[key]) {
          endpointMap[key] = {
            endpoint: log.endpoint,
            method: log.method,
            request_count: 0,
            response_times: [],
            unique_users: new Set(),
            error_count: 0
          };
        }
        endpointMap[key].request_count++;
        endpointMap[key].response_times.push(log.response_time_ms || 0);
        if (log.user_id) {
          endpointMap[key].unique_users.add(log.user_id);
        }
        if ((log.status_code || 0) >= 400) {
          endpointMap[key].error_count++;
        }
      });
    }

    const endpointStatsList = Object.values(endpointMap)
      .map(ep => ({
        endpoint: ep.endpoint,
        method: ep.method,
        request_count: ep.request_count,
        avg_response_time_ms: Math.round(
          ep.response_times.reduce((a: number, b: number) => a + b, 0) / ep.response_times.length
        ),
        unique_users: ep.unique_users.size,
        error_rate_percent: parseFloat(
          ((ep.error_count / ep.request_count) * 100).toFixed(2)
        )
      }))
      .sort((a, b) => b.request_count - a.request_count)
      .slice(0, 20); // Top 20

    const stats: ExtendedStats = {
      usage: {
        avg_daily_usage_minutes: parseFloat(avgDailyUsage.toFixed(2)),
        median_daily_usage_minutes: parseFloat(medianDailyUsage.toFixed(2)),
        max_daily_usage_minutes: parseFloat(maxDailyUsage.toFixed(2)),
        total_session_minutes_last_30days: totalSessionMinutes
      },
      access: {
        total_requests_today: (accessToday as any)?.length || 0,
        total_requests_last_7days: (accessLast7 as any)?.length || 0,
        total_requests_last_30days: (accessLast30 as any)?.length || 0,
        avg_response_time_ms: parseFloat(avgResponseTime.toFixed(2)),
        unique_users_today: uniqueUsersToday,
        unique_users_last_7days: uniqueUsersLast7,
        unique_users_last_30days: uniqueUsersLast30
      },
      active_users: {
        currently_active: activeData?.active_count || 0,
        very_active_1min: activeData?.very_active_count || 0,
        idle_but_online: activeData?.idle_count || 0,
        online_today: 0 // 計算は別途
      },
      daily_trend: dailyTrend.reverse(),
      endpoint_stats: endpointStatsList
    };

    // online_today を計算
    const { data: onlineTodayProfiles } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_activity', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    stats.active_users.online_today = (onlineTodayProfiles as any)?.length || 0;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Extended stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
