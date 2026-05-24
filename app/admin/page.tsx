'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchStats();
    // 30秒ごとに自動更新
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

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('管理者権限がありません');
          return;
        }
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString('ja-JP'));
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : '統計情報の取得に失敗しました');
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
            🔧 管理者ダッシュボード
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            margin: 0
          }}>
            最終更新: {lastUpdated}
            <button
              onClick={fetchStats}
              style={{
                marginLeft: '20px',
                padding: '6px 12px',
                background: 'rgba(0,212,255,0.2)',
                border: '1px solid rgba(0,212,255,0.4)',
                borderRadius: '4px',
                color: '#00d4ff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              🔄 更新
            </button>
          </p>
        </div>

        {/* KPI カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* ユーザー数 */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              👥 総ユーザー数
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#00d4ff', marginBottom: '8px' }}>
              {stats?.users.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              リミット: {stats?.limits.user_limit.toLocaleString()} 人
            </div>
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,212,255,0.1)',
              fontSize: '12px',
              color: stats?.limits.users_until_limit! > 1000 ? '#4ade80' : '#fbbf24'
            }}>
              あと {stats?.limits.users_until_limit.toLocaleString()} 人 ({Math.round(((stats?.users.total || 0) / (stats?.limits.user_limit || 1)) * 100)}%)
            </div>
          </div>

          {/* アクティブユーザー */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              📊 アクティブ（30日以内）
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>
              {stats?.users.active_30days.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              全ユーザーの {stats?.users.total ? Math.round((stats.users.active_30days / stats.users.total) * 100) : 0}%
            </div>
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,212,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              <div>📱 今日: {stats?.users.active_today}</div>
              <div>📅 7日: {stats?.users.active_7days}</div>
            </div>
          </div>

          {/* プレイリスト */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              🎵 プレイリスト
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#00d4ff', marginBottom: '8px' }}>
              {stats?.playlists.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              アイテム: {stats?.playlist_items.total.toLocaleString()} 個
            </div>
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,212,255,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              <div>🌐 公開: {stats?.playlists.public}</div>
              <div>🔒 非公開: {stats?.playlists.private}</div>
            </div>
          </div>

          {/* ストレージ使用量 */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              💾 ストレージ
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>
              {stats?.storage.estimated_usage_mb.toFixed(1)} MB
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              {stats?.storage.limit_mb} MB 中の {stats?.storage.estimated_usage_percent.toFixed(2)}%
            </div>
            {/* プログレスバー */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,212,255,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats?.storage.estimated_usage_percent || 0}%`,
                  height: '100%',
                  background: stats?.storage.estimated_usage_percent! > 80 ? '#ff6b6b' : '#4ade80'
                }} />
              </div>
            </div>
          </div>

          {/* 非アクティブ */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,100,100,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              ⚠️ 非アクティブ
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>3ヶ月</div>
                <div style={{ color: '#fbbf24', fontWeight: 600 }}>
                  {stats?.users.inactive_3months}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>6ヶ月</div>
                <div style={{ color: '#ff9f43', fontWeight: 600 }}>
                  {stats?.users.inactive_6months}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>12ヶ月</div>
                <div style={{ color: '#ff6b6b', fontWeight: 600 }}>
                  {stats?.users.inactive_12months}
                </div>
              </div>
            </div>
          </div>

          {/* 削除予定 */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,100,100,0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              🗑️ 削除予定
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12px'
            }}>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,100,100,0.2)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>⚠️ 警告待ち</div>
                <div style={{ color: '#fbbf24', fontWeight: 600, fontSize: '18px' }}>
                  {stats?.deletion_schedule.warning_pending}
                </div>
              </div>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,100,100,0.2)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>🗑️ 削除待ち</div>
                <div style={{ color: '#ff9f43', fontWeight: 600, fontSize: '18px' }}>
                  {stats?.deletion_schedule.playlist_deletion_pending}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* グラフセクション */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* サービス別分布 */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#00d4ff' }}>
              📺 サービス別アイテム
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(stats?.playlist_items.by_service || {}).map(([service, count]) => (
                <div key={service}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.8)' }}>
                      {service === 'database' ? 'REVOSONG' : service}
                    </span>
                    <span style={{ fontWeight: 600, color: '#00d4ff' }}>
                      {count} ({Math.round((count / (stats?.playlist_items.total || 1)) * 100)}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / (stats?.playlist_items.total || 1)) * 100}%`,
                      height: '100%',
                      background: 'rgba(0,212,255,0.6)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 種別別分布 */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#00d4ff' }}>
              🎬 種別別アイテム
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>🎵 音源</span>
                  <span style={{ fontWeight: 600, color: '#64c8ff' }}>
                    {stats?.playlist_items.by_type.audio} ({Math.round(((stats?.playlist_items.by_type.audio || 0) / (stats?.playlist_items.total || 1)) * 100)}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((stats?.playlist_items.by_type.audio || 0) / (stats?.playlist_items.total || 1)) * 100}%`,
                    height: '100%',
                    background: '#64c8ff'
                  }} />
                </div>
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>🎬 動画</span>
                  <span style={{ fontWeight: 600, color: '#ff6b6b' }}>
                    {stats?.playlist_items.by_type.video} ({Math.round(((stats?.playlist_items.by_type.video || 0) / (stats?.playlist_items.total || 1)) * 100)}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((stats?.playlist_items.by_type.video || 0) / (stats?.playlist_items.total || 1)) * 100}%`,
                    height: '100%',
                    background: '#ff6b6b'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 注釈 */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.15)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong style={{ color: '#00d4ff' }}>💡 注意事項：</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>このダッシュボードは30秒ごとに自動更新されます</li>
            <li>ユーザーリミット：5,000人（到達時は新規登録停止）</li>
            <li>ストレージ推定値：1ユーザーあたり55KB × 登録ユーザー数</li>
            <li>非アクティブユーザー削除スケジュール：3/6/12ヶ月</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
