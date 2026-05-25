'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type UserProfile = {
  id: string;
  email?: string;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  show_avatar?: boolean;
  show_avatar_on_comments?: boolean;
};

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // チェックボックスの状態
  const [showAvatar, setShowAvatar] = useState(true);
  const [showAvatarOnComments, setShowAvatarOnComments] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setError('ログインが必要です');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (err) {
      console.error('Profile fetch error:', err);
      setError('プロフィール情報の取得に失敗しました');
      return;
    }

    setProfile(data);
    setShowAvatar(data?.show_avatar ?? true);
    setShowAvatarOnComments(data?.show_avatar_on_comments ?? true);
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({
          show_avatar: showAvatar,
          show_avatar_on_comments: showAvatarOnComments,
        })
        .eq('id', user.id);

      if (err) {
        setError('設定の保存に失敗しました: ' + err.message);
      } else {
        setMessage('設定を保存しました！');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError('エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        読み込み中...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>ログインが必要です</div>
          <Link href="/" style={{
            color: '#ff2d55',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            color: '#00d4ff',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            ← トップページに戻る
          </Link>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            設定
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px'
          }}>
            アバター表示やプライバシー設定を管理します
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            background: 'rgba(48,209,88,0.15)',
            border: '1px solid rgba(48,209,88,0.3)',
            borderRadius: '8px',
            color: '#30d158',
            fontSize: '13px'
          }}>
            ✓ {message}
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            background: 'rgba(255,59,48,0.15)',
            border: '1px solid rgba(255,59,48,0.3)',
            borderRadius: '8px',
            color: '#ff3b30',
            fontSize: '13px'
          }}>
            ✗ {error}
          </div>
        )}

        {/* Settings Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          {/* Section: Account Info */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#fff'
            }}>
              アカウント情報
            </h2>
            <div style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>メールアドレス:</span> {user.email}
              </div>
              {profile?.username && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>ユーザー名:</span> {profile.username}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            margin: '24px 0'
          }} />

          {/* Section: Avatar & Privacy Settings */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#fff'
            }}>
              アバター表示とプライバシー
            </h2>

            {/* Setting 1: Show Avatar on Artist Profile */}
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={showAvatar}
                  onChange={(e) => setShowAvatar(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    プロフィール画像を表示
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '4px'
                  }}>
                    曲の再生ページであなたのプロフィール画像を表示します
                  </div>
                </div>
              </label>
            </div>

            {/* Setting 2: Show Avatar on Comments */}
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={showAvatarOnComments}
                  onChange={(e) => setShowAvatarOnComments(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    コメント時にプロフィール画像を表示
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '4px'
                  }}>
                    コメント欄であなたのプロフィール画像を表示します
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: saving ? 'rgba(255,45,85,0.3)' : 'linear-gradient(135deg, #ff2d55, #ff6482)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: saving ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!saving) {
                  (e.target as HTMLButtonElement).style.opacity = '0.8';
                }
              }}
              onMouseOut={(e) => {
                if (!saving) {
                  (e.target as HTMLButtonElement).style.opacity = '1';
                }
              }}
            >
              {saving ? '保存中...' : '設定を保存'}
            </button>
            <Link href="/" style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>
              キャンセル
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '30px',
          padding: '16px',
          background: 'rgba(255,149,0,0.05)',
          border: '1px solid rgba(255,149,0,0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.7)'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            💡 プライバシーについて
          </div>
          <div style={{ lineHeight: '1.6' }}>
            アバター表示をオンにすることで、あなたのプロフィール画像を通じてアカウントへの認識性が高まります。
            これにより、フォロワーが増えたり、SNSでのつながりが深まる可能性があります。
          </div>
        </div>
      </div>
    </div>
  );
}
