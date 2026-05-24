'use client';

import { useState } from 'react';
import { EmbedPlayer, getServiceName } from './EmbedPlayer';

interface AddPlaylistItemProps {
  onSubmit: (data: {
    externalUrl?: string;
    trackId?: number;
    musicType?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface MetadataPreview {
  service: string;
  title?: string;
  artist?: string;
  thumbnailUrl?: string;
  musicType?: string;
}

interface Track {
  id: number;
  title: string;
  artist_name: string;
  ai_tool: string;
  genre: string;
  music_type: string;
  external_url: string | null;
  play_count: number;
  photo_url: string | null;
}

export function AddPlaylistItem({
  onSubmit,
  onCancel,
  isLoading = false
}: AddPlaylistItemProps) {
  const [mode, setMode] = useState<'url' | 'track'>('url');
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState<MetadataPreview | null>(null);
  const [musicType, setMusicType] = useState('audio');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // REVOSONG楽曲検索用state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const extractMetadata = async (externalUrl: string) => {
    setIsLoadingMetadata(true);
    setError(null);

    try {
      const response = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: externalUrl })
      });

      if (!response.ok) {
        throw new Error('メタデータの取得に失敗しました');
      }

      const data = await response.json();
      setMetadata(data);
      setMusicType(data.musicType || 'audio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setMetadata({
        service: getServiceName(externalUrl),
        title: 'タイトル不明',
        artist: 'アーティスト不明',
        musicType: 'audio'
      });
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setMetadata(null);
    setError(null);
  };

  const handleSearchTracks = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/tracks/search?q=${encodeURIComponent(query)}&limit=20`);

      if (!response.ok) {
        throw new Error('検索に失敗しました');
      }

      const data = await response.json();
      setSearchResults(data.tracks || []);
    } catch (err) {
      console.error('Track search error:', err);
      setError(err instanceof Error ? err.message : '検索中にエラーが発生しました');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    await extractMetadata(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'url' && !metadata) {
        setError('URLの確認をしてください');
        return;
      }

      if (mode === 'track' && !selectedTrack) {
        setError('楽曲を選択してください');
        return;
      }

      await onSubmit({
        externalUrl: mode === 'url' ? url : undefined,
        trackId: mode === 'track' ? selectedTrack?.id : undefined,
        musicType: musicType
      });

      // リセット
      setUrl('');
      setMetadata(null);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedTrack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflowY: 'auto'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1420 100%)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          margin: '20px 0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff'
          }}
        >
          プレイリストにアイテムを追加
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Mode Selection */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('url');
                  setMetadata(null);
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: mode === 'url' ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'url') (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'url') (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                外部URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('track');
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: mode === 'track' ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'track') (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'track') (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                REVOSONG楽曲
              </button>
            </div>
          </div>

          {/* Track Mode */}
          {mode === 'track' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#fff'
                  }}
                >
                  楽曲を検索
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchTracks(e.target.value)}
                  placeholder="タイトルまたはアーティスト名で検索..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.08)';
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 45, 85, 0.5)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.05)';
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  disabled={isSearching || isLoading}
                />
              </div>

              {/* 検索結果 */}
              {(isSearching || searchResults.length > 0) && (
                <div style={{ marginBottom: '20px' }}>
                  {isSearching && (
                    <div
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px'
                      }}
                    >
                      検索中...
                    </div>
                  )}

                  {!isSearching && searchResults.length === 0 && searchQuery && (
                    <div
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px'
                      }}
                    >
                      該当する楽曲が見つかりません
                    </div>
                  )}

                  {searchResults.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '8px',
                        background: selectedTrack?.id === track.id
                          ? 'rgba(255, 45, 85, 0.3)'
                          : 'rgba(255, 255, 255, 0.08)',
                        border: selectedTrack?.id === track.id
                          ? '1px solid rgba(255, 45, 85, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTrack?.id !== track.id) {
                          (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.12)';
                          (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 45, 85, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTrack?.id !== track.id) {
                          (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                          (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      <div style={{ marginBottom: '4px' }}>
                        <strong>{track.title}</strong>
                        {selectedTrack?.id === track.id && (
                          <span style={{ marginLeft: '8px', color: '#ff2d55' }}>✓</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {track.artist_name}
                        {track.ai_tool && ` • ${track.ai_tool}`}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                        🎵 {track.play_count.toLocaleString()}再生
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 選択済み楽曲のプレビュー */}
              {selectedTrack && (
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  >
                    {selectedTrack.photo_url && (
                      <img
                        src={selectedTrack.photo_url}
                        alt={selectedTrack.title}
                        style={{
                          width: '100%',
                          borderRadius: '6px',
                          marginBottom: '12px',
                          maxHeight: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#fff',
                          marginBottom: '4px'
                        }}
                      >
                        {selectedTrack.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {selectedTrack.artist_name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedTrack.ai_tool && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(100, 150, 255, 0.4)',
                            color: '#fff'
                          }}
                        >
                          🤖 {selectedTrack.ai_tool}
                        </span>
                      )}
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: 'rgba(255, 45, 85, 0.4)',
                          color: '#fff'
                        }}
                      >
                        REVOSONG
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* URL Mode */}
          {mode === 'url' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#fff'
                  }}
                >
                  URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://youtube.com/watch?v=... または他のサービスのURL"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.08)';
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 45, 85, 0.5)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.05)';
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  disabled={isLoading || isLoadingMetadata}
                />
              </div>

              {!metadata && (
                <button
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={isLoading || isLoadingMetadata || !url.trim()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#ff2d55',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading || isLoadingMetadata ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '20px',
                    opacity: isLoading || isLoadingMetadata ? 0.6 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !isLoadingMetadata) (e.target as HTMLButtonElement).style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && !isLoadingMetadata) (e.target as HTMLButtonElement).style.opacity = '1';
                  }}
                >
                  {isLoadingMetadata ? '読み込み中...' : 'プレビューを読み込む'}
                </button>
              )}

              {metadata && (
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  >
                    {metadata.thumbnailUrl && (
                      <img
                        src={metadata.thumbnailUrl}
                        alt="Thumbnail"
                        style={{
                          width: '100%',
                          borderRadius: '6px',
                          marginBottom: '12px',
                          maxHeight: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#fff',
                          marginBottom: '4px'
                        }}
                      >
                        {metadata.title || 'タイトル不明'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {metadata.artist || 'アーティスト不明'}
                      </div>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'rgba(100, 150, 255, 0.4)',
                        color: '#fff'
                      }}
                    >
                      {metadata.service}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMetadata(null)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '16px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    別のURLを試す
                  </button>
                </div>
              )}
            </>
          )}

          {/* Music Type Selection */}
          {metadata && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff'
                }}
              >
                コンテンツタイプ
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setMusicType('audio')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: musicType === 'audio' ? 'rgba(100, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  🎵 音源
                </button>
                <button
                  type="button"
                  onClick={() => setMusicType('video')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: musicType === 'video' ? 'rgba(255, 100, 100, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  🎬 動画
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(255, 100, 100, 0.2)',
                border: '1px solid rgba(255, 100, 100, 0.5)',
                borderRadius: '6px',
                color: '#ffcccc',
                fontSize: '14px',
                marginBottom: '20px'
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading || !metadata}
              style={{
                padding: '10px 20px',
                background: '#ff2d55',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading || !metadata ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                opacity: isLoading || !metadata ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading && metadata) (e.target as HTMLButtonElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                if (!isLoading && metadata) (e.target as HTMLButtonElement).style.opacity = '1';
              }}
            >
              {isLoading ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
