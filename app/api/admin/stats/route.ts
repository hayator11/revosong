import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 管理者ユーザーのメールアドレス（環境変数で設定）
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',');

interface AdminStats {
  users: {
    total: number;
    active_30days: number;
    active_7days: number;
    active_today: number;
    inactive_3months: number;
    inactive_6months: number;
    inactive_12months: number;
  };
  playlists: {
    total: number;
    public: number;
    private: number;
  };
  playlist_items: {
    total: number;
    by_service: Record<string, number>;
    by_type: Record<string, number>;
  };
  storage: {
    estimated_usage_mb: number;
    estimated_usage_percent: number;
    limit_mb: number;
  };
  limits: {
    user_limit: number;
    current_users: number;
    users_until_limit: number;
  };
  deletion_schedule: {
    warning_pending: number;
    playlist_deletion_pending: number;
    account_deletion_pending: number;
  };
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

    // ========== ユーザー統計 ==========
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' });

    const { count: active30 } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_login', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { count: active7 } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_login', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const { count: activeToday } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_login', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { count: inactive3m } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString());

    const { count: inactive6m } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString());

    const { count: inactive12m } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString());

    // ========== プレイリスト統計 ==========
    const { count: totalPlaylists } = await supabase
      .from('playlists')
      .select('id', { count: 'exact' });

    const { count: publicPlaylists } = await supabase
      .from('playlists')
      .select('id', { count: 'exact' })
      .eq('is_public', true);

    const privateCount = (totalPlaylists || 0) - (publicPlaylists || 0);

    // ========== プレイリストアイテム統計 ==========
    const { count: totalItems } = await supabase
      .from('playlist_items')
      .select('id', { count: 'exact' });

    // サービス別の統計
    const { data: itemsByService } = await supabase
      .from('playlist_items')
      .select('external_service')
      .not('external_service', 'is', null);

    const serviceCount: Record<string, number> = {
      youtube: 0,
      spotify: 0,
      soundcloud: 0,
      niconico: 0,
      bandcamp: 0,
      audiomack: 0,
      database: 0
    };

    itemsByService?.forEach((item: any) => {
      if (item.external_service) {
        serviceCount[item.external_service]++;
      }
    });

    // track_id で DB内の曲の数をカウント
    const { count: dbTracks } = await supabase
      .from('playlist_items')
      .select('id', { count: 'exact' })
      .not('track_id', 'is', null);

    serviceCount['database'] = dbTracks || 0;

    // 種別別統計（audio/video）
    const { data: itemsByType } = await supabase
      .from('playlist_items')
      .select('music_type');

    const typeCount: Record<string, number> = { audio: 0, video: 0 };
    itemsByType?.forEach((item: any) => {
      if (item.music_type === 'audio') typeCount.audio++;
      if (item.music_type === 'video') typeCount.video++;
    });

    // ========== ストレージ使用量推定 ==========
    // 1ユーザーあたり約55KB
    const estimatedUsageMb = ((totalUsers || 0) * 55) / 1024;
    const estimatedUsagePercent = (estimatedUsageMb / 1024) * 100;

    // ========== リミット情報 ==========
    const USER_LIMIT = 5000;
    const usersUntilLimit = USER_LIMIT - (totalUsers || 0);

    // ========== 削除予定ユーザー ==========
    const { count: warningPending } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString())
      .gte('last_login', new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString());

    const { count: playlistDeletionPending } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
      .gte('last_login', new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString());

    const { count: accountDeletionPending } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .lt('last_login', new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString());

    const stats: AdminStats = {
      users: {
        total: totalUsers || 0,
        active_30days: active30 || 0,
        active_7days: active7 || 0,
        active_today: activeToday || 0,
        inactive_3months: inactive3m || 0,
        inactive_6months: inactive6m || 0,
        inactive_12months: inactive12m || 0
      },
      playlists: {
        total: totalPlaylists || 0,
        public: publicPlaylists || 0,
        private: privateCount
      },
      playlist_items: {
        total: totalItems || 0,
        by_service: serviceCount,
        by_type: typeCount
      },
      storage: {
        estimated_usage_mb: Math.round(estimatedUsageMb * 100) / 100,
        estimated_usage_percent: Math.round(estimatedUsagePercent * 100) / 100,
        limit_mb: 1024
      },
      limits: {
        user_limit: USER_LIMIT,
        current_users: totalUsers || 0,
        users_until_limit: usersUntilLimit
      },
      deletion_schedule: {
        warning_pending: warningPending || 0,
        playlist_deletion_pending: playlistDeletionPending || 0,
        account_deletion_pending: accountDeletionPending || 0
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
