'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { detectService, parseDefaultMetadata, fetchMetadataFromApi } from '@/lib/playlist-utils';
import { AddPlaylistItem } from '@/app/components/AddPlaylistItem';
import { PlaylistItemCard } from '@/app/components/PlaylistItemCard';
import { EmbedPlayer } from '@/app/components/EmbedPlayer';

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

interface PlaylistItem {
  id: number;
  playlist_id: number;
  track_id: number | null;
  external_url: string | null;
  external_title: string | null;
  external_artist: string | null;
  external_thumbnail_url: string | null;
  external_service: string | null;
  music_type: string;
  order_index: number;
  added_at: string;
  title: string;
  artist: string;
  url: string;
  thumbnail_url: string | null;
}

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const playlistId = parseInt(params.id as string);

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [addFormData, setAddFormData] = useState({
    url: '',
    trackSearch: '',
    selectedTrackId: null as number | null
  });

  // Drag and drop state
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null);

  // Playback state
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [playMode, setPlayMode] = useState<'auto' | 'shuffle' | 'once' | 'repeat-one'>('shuffle');
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch current user and playlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // Fetch playlist
        const response = await fetch(`/api/playlists/${playlistId}`);

        if (!response.ok) {
          throw new Error('Playlist not found');
        }

        const data = await response.json();
        setPlaylist(data.playlist);
        setItems(data.items || []);

        // Check if current user is owner
        if (currentUser && data.playlist.user_id === currentUser.id) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(playlistId)) {
      fetchData();
    }
  }, [playlistId]);

  // Playback control functions
  const handlePlayItem = (index: number) => {
    setCurrentItemIndex(index);
    setIsPlaying(true);
  };

  const handlePlayNext = () => {
    if (currentItemIndex === null || items.length === 0) return;

    if (playMode === 'shuffle') {
      // Random next song
      const randomIndex = Math.floor(Math.random() * items.length);
      setCurrentItemIndex(randomIndex);
      setIsPlaying(true);
    } else {
      // Sequential next song
      const nextIndex = currentItemIndex + 1;
      if (nextIndex < items.length) {
        setCurrentItemIndex(nextIndex);
        setIsPlaying(true);
      } else {
        // End of playlist - stop
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPrevious = () => {
    if (currentItemIndex === null) return;

    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleTrackEnd = () => {
    if (playMode === 'repeat-one' && currentItemIndex !== null) {
      // Restart the current song
      setIsPlaying(true);
    } else if (playMode === 'once') {
      // Stop after current song
      setIsPlaying(false);
    } else if (playMode === 'auto' || playMode === 'shuffle') {
      // Play next song automatically
      handlePlayNext();
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addFormData.url && !addFormData.selectedTrackId) {
      setError('URLまたはトラックを選択してください');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      let itemData: any = {
        music_type: 'audio'
      };

      if (addFormData.url) {
        // External URL
        const service = detectService(addFormData.url);
        if (!service) {
          setError('サポートされていないURLです');
          return;
        }

        try {
          const metadata = await fetchMetadataFromApi(addFormData.url, session.access_token);
          itemData = {
            ...itemData,
            external_url: addFormData.url,
            external_service: metadata.service,
            external_title: metadata.title,
            external_artist: metadata.artist || '',
            external_thumbnail_url: metadata.thumbnail_url || '',
            music_type: service === 'youtube' || service === 'niconico' ? 'video' : 'audio'
          };
        } catch (err) {
          setError('メタデータ取得に失敗しました');
          return;
        }
      } else if (addFormData.selectedTrackId) {
        // DB track
        itemData = {
          ...itemData,
          track_id: addFormData.selectedTrackId
        };
      }

      const response = await fetch(`/api/playlists/${playlistId}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      const newItem = await response.json();
      setItems([...items, newItem]);
      setAddFormData({ url: '', trackSearch: '', selectedTrackId: null });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('このアイテムを削除しますか？')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      const response = await fetch(`/api/playlists/${playlistId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (itemId: number) => {
    setDraggedItemId(itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: number) => {
    e.preventDefault();
    setDragOverItemId(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetItemId: number) => {
    e.preventDefault();
    setDragOverItemId(null);

    if (!draggedItemId || draggedItemId === targetItemId) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      // Find the indices of the dragged and target items
      const draggedIndex = items.findIndex(item => item.id === draggedItemId);
      const targetIndex = items.findIndex(item => item.id === targetItemId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Create a new order
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);

      // Update the local state immediately for better UX
      setItems(newItems);
      setDraggedItemId(null);

      // Send reorder request to server
      const reorderData = newItems.map((item, index) => ({
        id: item.id,
        order_index: index
      }));

      const response = await fetch(`/api/playlists/${playlistId}/items/reorder`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: reorderData })
      });

      if (!response.ok) {
        throw new Error('Failed to reorder items');
      }
    } catch (err) {
      console.error('Error reordering items:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder items');
      // Revert the optimistic update on error
      // In a production app, you might want to refetch the items here
    }
  };

  // Toggle privacy setting
  const handleTogglePrivacy = async () => {
    if (!playlist) return;

    setToggleLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired');
        return;
      }

      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_public: !playlist.is_public
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy setting');
      }

      const updatedPlaylist = await response.json();
      setPlaylist(updatedPlaylist);
      setError(null);
    } catch (err) {
      console.error('Error toggling privacy:', err);
      setError(err instanceof Error ? err.message : 'Failed to update privacy setting');
    } finally {
      setToggleLoading(false);
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

  if (!playlist) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        color: '#fff',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1>プレイリストが見つかりません</h1>
          <Link href="/playlists" style={{
            display: 'inline-block',
            marginTop: '20px',
            color: '#00d4ff',
            textDecoration: 'none'
          }}>
            プレイリスト一覧に戻る
          </Link>
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
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <Link href="/playlists" style={{
            display: 'inline-block',
            color: '#00d4ff',
            textDecoration: 'none',
            fontSize: '14px',
            marginRight: '10px'
          }}>
            プレイリスト一覧
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '10px' }}>
            {playlist.title}
          </span>
        </div>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: '30px',
          marginBottom: '40px',
          alignItems: 'start'
        }}>
          {/* Cover */}
          <div>
            {playlist.cover_image_url ? (
              <img
                src={playlist.cover_image_url}
                alt={playlist.title}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,212,255,0.2)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.05))',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                🎵
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '10px',
              color: '#00d4ff'
            }}>
              {playlist.title}
            </h1>

            {playlist.description && (
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '20px',
                lineHeight: 1.6
              }}>
                {playlist.description}
              </p>
            )}

            <div style={{
              display: 'flex',
              gap: '30px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ color: '#00d4ff', fontWeight: 600 }}>🎵</span> {items.length} 曲
              </div>
              <div>
                <span style={{ color: '#00d4ff', fontWeight: 600 }}>▶</span> {playlist.play_count} 再生
              </div>
              <div>
                {playlist.is_public ? (
                  <>
                    <span style={{ color: '#00d4ff', fontWeight: 600 }}>🌐</span> 公開
                  </>
                ) : (
                  <>
                    <span style={{ color: '#00d4ff', fontWeight: 600 }}>🔒</span> プライベート
                  </>
                )}
              </div>
            </div>

            {isOwner && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(0,212,255,0.2)',
                    border: '1px solid rgba(0,212,255,0.4)',
                    borderRadius: '6px',
                    color: '#00d4ff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
                  }}>
                  + 曲を追加
                </button>

                <button
                  onClick={handleTogglePrivacy}
                  disabled={toggleLoading}
                  style={{
                    padding: '10px 20px',
                    background: playlist.is_public ? 'rgba(0,212,255,0.2)' : 'rgba(255,45,85,0.2)',
                    border: playlist.is_public ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,45,85,0.4)',
                    borderRadius: '6px',
                    color: playlist.is_public ? '#00d4ff' : '#ff2d55',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: toggleLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: toggleLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!toggleLoading) {
                      e.currentTarget.style.background = playlist.is_public ? 'rgba(0,212,255,0.3)' : 'rgba(255,45,85,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!toggleLoading) {
                      e.currentTarget.style.background = playlist.is_public ? 'rgba(0,212,255,0.2)' : 'rgba(255,45,85,0.2)';
                    }
                  }}>
                  {playlist.is_public ? '🌐 公開中' : '🔒 プライベート'}
                </button>
              </div>
            )}
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

        {/* Playback Controls */}
        {items.length > 0 && (
          <div style={{
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            {/* Currently playing */}
            {currentItemIndex !== null && currentItemIndex < items.length ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  ▶ 再生中
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#00d4ff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {items[currentItemIndex].title}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px'
                }}>
                  {items[currentItemIndex].artist}
                </div>
              </div>
            ) : (
              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '20px'
              }}>
                再生する曲を選択してください
              </div>
            )}

            {/* Playback controls */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}>
              {/* Previous button */}
              <button
                onClick={handlePlayPrevious}
                disabled={currentItemIndex === null || currentItemIndex === 0}
                style={{
                  padding: '8px 16px',
                  background: currentItemIndex === null || currentItemIndex === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,212,255,0.2)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '6px',
                  color: currentItemIndex === null || currentItemIndex === 0 ? 'rgba(255,255,255,0.3)' : '#00d4ff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: currentItemIndex === null || currentItemIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ⏮ 前曲
              </button>

              {/* Play/Pause button */}
              <button
                onClick={() => currentItemIndex !== null ? setIsPlaying(!isPlaying) : null}
                disabled={currentItemIndex === null}
                style={{
                  padding: '8px 16px',
                  background: currentItemIndex === null ? 'rgba(255,255,255,0.1)' : isPlaying ? 'rgba(255,45,85,0.2)' : 'rgba(0,212,255,0.2)',
                  border: currentItemIndex === null ? '1px solid rgba(255,255,255,0.2)' : isPlaying ? '1px solid rgba(255,45,85,0.3)' : '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '6px',
                  color: currentItemIndex === null ? 'rgba(255,255,255,0.3)' : isPlaying ? '#ff2d55' : '#00d4ff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: currentItemIndex === null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isPlaying ? '⏸ 一時停止' : '▶ 再生'}
              </button>

              {/* Next button */}
              <button
                onClick={handlePlayNext}
                disabled={currentItemIndex === null || currentItemIndex >= items.length - 1}
                style={{
                  padding: '8px 16px',
                  background: currentItemIndex === null || currentItemIndex >= items.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0,212,255,0.2)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '6px',
                  color: currentItemIndex === null || currentItemIndex >= items.length - 1 ? 'rgba(255,255,255,0.3)' : '#00d4ff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: currentItemIndex === null || currentItemIndex >= items.length - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                次曲 ⏭
              </button>
            </div>

            {/* Play mode */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setPlayMode('auto')}
                style={{
                  padding: '8px 16px',
                  background: playMode === 'auto' ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: playMode === 'auto' ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: playMode === 'auto' ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                順番に流れる
              </button>

              <button
                onClick={() => setPlayMode('shuffle')}
                style={{
                  padding: '8px 16px',
                  background: playMode === 'shuffle' ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: playMode === 'shuffle' ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: playMode === 'shuffle' ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🎲 ランダム
              </button>

              <button
                onClick={() => setPlayMode('once')}
                style={{
                  padding: '8px 16px',
                  background: playMode === 'once' ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: playMode === 'once' ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: playMode === 'once' ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                1曲だけ
              </button>

              <button
                onClick={() => setPlayMode('repeat-one')}
                style={{
                  padding: '8px 16px',
                  background: playMode === 'repeat-one' ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: playMode === 'repeat-one' ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: playMode === 'repeat-one' ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔁 1曲リピート
              </button>
            </div>
          </div>
        )}

        {/* Add item form */}
        {isOwner && showAddForm && (
          <AddPlaylistItem
            onSubmit={async (data) => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                  setError('Session expired');
                  return;
                }

                const itemData: any = {
                  music_type: data.musicType || 'audio'
                };

                if (data.externalUrl) {
                  const service = detectService(data.externalUrl);
                  if (!service) {
                    setError('サポートされていないURLです');
                    return;
                  }

                  try {
                    const metadata = await fetchMetadataFromApi(data.externalUrl, session.access_token);
                    itemData.external_url = data.externalUrl;
                    itemData.external_service = metadata.service;
                    itemData.external_title = metadata.title;
                    itemData.external_artist = metadata.artist || '';
                    itemData.external_thumbnail_url = metadata.thumbnail_url || '';
                  } catch (err) {
                    setError('メタデータ取得に失敗しました');
                    return;
                  }
                } else if (data.trackId) {
                  // REVOSONG楽曲を追加
                  itemData.track_id = data.trackId;
                } else {
                  setError('楽曲またはURLを選択してください');
                  return;
                }

                const response = await fetch(`/api/playlists/${playlistId}/items`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(itemData)
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || 'Failed to add item');
                }

                const newItem = await response.json();
                setItems([...items, newItem]);
                setShowAddForm(false);
                setError(null);
              } catch (err) {
                console.error('Error adding item:', err);
                setError(err instanceof Error ? err.message : 'Failed to add item');
              }
            }}
            onCancel={() => {
              setShowAddForm(false);
              setError(null);
            }}
          />
        )}

        {/* Items list */}
        {items.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <p style={{ fontSize: '16px' }}>
              このプレイリストにはまだ曲が追加されていません
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable={isOwner}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                style={{
                  cursor: isOwner ? 'grab' : 'default',
                  opacity: draggedItemId === item.id ? 0.5 : 1,
                  backgroundColor: currentItemIndex === index ? 'rgba(0, 212, 255, 0.1)' : dragOverItemId === item.id ? 'rgba(255, 45, 85, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <PlaylistItemCard
                  item={item}
                  onDelete={isOwner ? handleDeleteItem : undefined}
                  isDragging={draggedItemId === item.id}
                  onPlay={() => handlePlayItem(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
