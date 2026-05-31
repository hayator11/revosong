'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Playlist {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  play_count: number;
  created_at: string;
  updated_at: string;
}

interface PlaylistWithItemCount extends Playlist {
  item_count: number;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistWithItemCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Fetch current user and playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          router.push('/');
          return;
        }

        setUser(currentUser);

        // Get user's session token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Session expired');
          return;
        }

        // Fetch playlists
        const response = await fetch('/api/playlists', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }

        const data = await response.json();

        // Fetch item counts for each playlist
        const playlistsWithCounts = await Promise.all(
          data.playlists.map(async (playlist: Playlist) => {
            const { count } = await supabase
              .from('playlist_items')
              .select('id', { count: 'exact' })
              .eq('playlist_id', playlist.id);

            return {
              ...playlist,
              item_count: count || 0
            };
          })
        );

        setPlaylists(playlistsWithCounts);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const newPlaylist = await response.json();

      setPlaylists([
        {
          ...newPlaylist,
          item_count: 0
        },
        ...playlists
      ]);

      setFormData({ title: '', description: '' });
      setShowCreateForm(false);

      // Redirect to new playlist
      router.push(`/playlists/${newPlaylist.id}`);
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      setPlaylists(playlists.filter(p => p.id !== playlistId));
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
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

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      color: '#fff',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            marginBottom: '20px',
            padding: '8px 12px',
            background: 'rgba(0,212,255,0.15)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '6px',
            color: '#00d4ff',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
          }}>
            ← ランキングに戻る
          </Link>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#00d4ff'
          }}>
            🎵 マイプレイリスト
          </h1>

          {/* Description Section */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.05))',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.6,
              margin: '0 0 12px 0'
            }}>
              <strong style={{ color: '#00d4ff' }}>自分だけの音楽リストを作成しよう！</strong>
            </p>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              margin: 0
            }}>
              YouTube / SoundCloud のURLを登録して、自分だけのプレイリストを作成できます。
              登録した曲は一覧から再生・削除でき、公開・非公開を設定することも可能です。
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: '8px',
            color: '#ff6b6b',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Create button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '12px 24px',
            background: 'rgba(0,212,255,0.2)',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: '8px',
            color: '#00d4ff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '30px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
          }}>
          + 新しいプレイリストを作成
        </button>

        {/* Create form */}
        {showCreateForm && (
          <form onSubmit={handleCreatePlaylist} style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#00d4ff'
              }}>
                プレイリスト名
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="プレイリスト名を入力"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#00d4ff'
              }}>
                説明（オプション）
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="プレイリストの説明を入力"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: 'rgba(0,212,255,0.3)',
                  border: '1px solid rgba(0,212,255,0.5)',
                  borderRadius: '6px',
                  color: '#00d4ff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.3)';
                }}>
                作成
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: '', description: '' });
                }}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}>
                キャンセル
              </button>
            </div>
          </form>
        )}

        {/* Playlists grid */}
        {playlists.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
              プレイリストがまだありません
            </p>
            <p style={{ fontSize: '14px' }}>
              「新しいプレイリストを作成」ボタンからプレイリストを作成しましょう！
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {playlists.map(playlist => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                }}>
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '150px',
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.05))',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px'
                    }}>
                    🎵
                  </div>
                )}

                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {playlist.title}
                </h3>

                {playlist.description && (
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {playlist.description}
                  </p>
                )}

                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: 'auto'
                }}>
                  🎵 {playlist.item_count} 曲
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
