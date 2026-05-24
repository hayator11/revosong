'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ExtendedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/admin/stats-extended', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString('ja-JP'));
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('統計情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        color: '#fff',
        padding: '40px 20px'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          読み込み中...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        color: '#fff',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#ff6b6b' }}>⚠️ エラー</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      color: '#fff',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '10px',
            color: '#00d4ff'
          }}>
            📊 詳細ダッシュボード
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            margin: 0
          }}>
            使用時間・アクセス数・アクティブ利用者数
          </p>
        </div>

        {/* 使用時間セクション */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#00d4ff',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ⏱️ 使用時間統計
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {/* 平均使用時間 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📈 平均1日の使用時間
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ade80', marginBottom: '4px' }}>
                {stats?.usage.avg_daily_usage_minutes.toFixed(1)} 分
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                月間合計: {stats?.usage.total_session_minutes_last_30days.toLocaleString()} 分
              </div>
            </div>

            {/* 中央値 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📊 中央値（1日）
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#64c8ff' }}>
                {stats?.usage.median_daily_usage_minutes.toFixed(1)} 分
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                50% のユーザーがこれ以上使用
              </div>
            </div>

            {/* 最大使用時間 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                🔥 最大1日の使用時間
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fbbf24' }}>
                {stats?.usage.max_daily_usage_minutes.toFixed(1)} 分
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ピーク日の記録
              </div>
            </div>
          </div>
        </div>

        {/* アクセス数セクション */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#00d4ff',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🔗 アクセス数統計
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {/* 本日のリクエスト */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📱 本日のアクセス
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00d4ff', marginBottom: '4px' }}>
                {stats?.access.total_requests_today.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ユーザー: {stats?.access.unique_users_today}人
              </div>
            </div>

            {/* 7日間 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📅 7日間のアクセス
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00d4ff', marginBottom: '4px' }}>
                {stats?.access.total_requests_last_7days.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ユーザー: {stats?.access.unique_users_last_7days}人
              </div>
            </div>

            {/* 30日間 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📈 30日間のアクセス
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#00d4ff', marginBottom: '4px' }}>
                {stats?.access.total_requests_last_30days.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ユーザー: {stats?.access.unique_users_last_30days}人
              </div>
            </div>

            {/* 平均レスポンスタイム */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                ⚡ 平均レスポンスタイム
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stats?.access.avg_response_time_ms! < 500 ? '#4ade80' : '#fbbf24', marginBottom: '4px' }}>
                {stats?.access.avg_response_time_ms.toFixed(0)} ms
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                {stats?.access.avg_response_time_ms! < 500 ? '✅ 良好' : '⚠️ 要監視'}
              </div>
            </div>
          </div>
        </div>

        {/* アクティブ利用者数セクション */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#00d4ff',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            👥 アクティブ利用者数
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {/* 現在使用中 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                🟢 現在使用中（5分以内）
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ade80', marginBottom: '4px' }}>
                {stats?.active_users.currently_active}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                今この瞬間のアクティブユーザー
              </div>
            </div>

            {/* 非常に活発 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                🔥 非常に活発（1分以内）
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#ff6b6b', marginBottom: '4px' }}>
                {stats?.active_users.very_active_1min}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                直前1分以内の操作
              </div>
            </div>

            {/* 本日ログイン */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                📱 本日ログイン
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#64c8ff', marginBottom: '4px' }}>
                {stats?.active_users.online_today}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                24時間以内のアクティブ
              </div>
            </div>

            {/* アイドル中 */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                😴 アイドル中（5分以上）
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>
                {stats?.active_users.idle_but_online}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                オンラインだが操作なし
              </div>
            </div>
          </div>
        </div>

        {/* 日別トレンド */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '12px',
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#00d4ff' }}>
            📈 過去7日間の日別トレンド
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px'
          }}>
            {stats?.daily_trend.map((day, idx) => (
              <div key={idx} style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr 1fr 1fr',
                gap: '16px',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {new Date(day.date).toLocaleDateString('ja-JP')}
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>アクティブ</div>
                  <div style={{ color: '#00d4ff', fontWeight: 600 }}>{day.active_users}人</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>アクセス</div>
                  <div style={{ color: '#00d4ff', fontWeight: 600 }}>{day.total_requests.toLocaleString()}回</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>平均使用</div>
                  <div style={{ color: '#4ade80', fontWeight: 600 }}>{day.avg_duration_minutes.toFixed(1)}分</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>応答時間</div>
                  <div style={{ color: day.avg_response_time_ms < 500 ? '#4ade80' : '#fbbf24', fontWeight: 600 }}>{day.avg_response_time_ms}ms</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* エンドポイント統計 */}
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '12px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#00d4ff' }}>
            🔧 エンドポイント統計（TOP 10）
          </h3>
          <div style={{
            overflowX: 'auto',
            fontSize: '12px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid rgba(0,212,255,0.2)',
                  color: '#00d4ff',
                  fontWeight: 600
                }}>
                  <th style={{ textAlign: 'left', padding: '8px', minWidth: '150px' }}>エンドポイント</th>
                  <th style={{ textAlign: 'center', padding: '8px', minWidth: '80px' }}>メソッド</th>
                  <th style={{ textAlign: 'center', padding: '8px', minWidth: '100px' }}>リクエスト数</th>
                  <th style={{ textAlign: 'center', padding: '8px', minWidth: '120px' }}>レスポンスタイム</th>
                  <th style={{ textAlign: 'center', padding: '8px', minWidth: '80px' }}>ユーザー</th>
                  <th style={{ textAlign: 'center', padding: '8px', minWidth: '80px' }}>エラー率</th>
                </tr>
              </thead>
              <tbody>
                {stats?.endpoint_stats.map((ep, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(0,212,255,0.1)',
                    background: idx % 2 === 0 ? 'rgba(0,212,255,0.03)' : 'transparent'
                  }}>
                    <td style={{ padding: '8px' }}>
                      <code style={{ fontSize: '11px', color: '#64c8ff' }}>{ep.endpoint}</code>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px' }}>
                      <span style={{
                        background: ep.method === 'GET' ? 'rgba(74,222,128,0.2)' :
                                  ep.method === 'POST' ? 'rgba(59,130,246,0.2)' :
                                  'rgba(248,113,113,0.2)',
                        color: ep.method === 'GET' ? '#4ade80' :
                               ep.method === 'POST' ? '#3b82f6' : '#f87171',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 600
                      }}>
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px', color: '#00d4ff' }}>
                      {ep.request_count.toLocaleString()}
                    </td>
                    <td style={{
                      textAlign: 'center',
                      padding: '8px',
                      color: ep.avg_response_time_ms < 500 ? '#4ade80' : '#fbbf24'
                    }}>
                      {ep.avg_response_time_ms}ms
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px', color: 'rgba(255,255,255,0.7)' }}>
                      {ep.unique_users}
                    </td>
                    <td style={{
                      textAlign: 'center',
                      padding: '8px',
                      color: ep.error_rate_percent > 5 ? '#ff6b6b' : '#4ade80'
                    }}>
                      {ep.error_rate_percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
