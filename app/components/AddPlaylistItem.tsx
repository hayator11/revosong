'use client';

import { useState } from 'react';
import { getServiceName } from './EmbedPlayer';
import { parseTrackUrl } from '@/lib/track-url-utils';

interface AddPlaylistItemProps {
  onSubmit: (data: {
    externalUrl: string;
    musicType: string;
    title?: string;
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

const fieldStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  boxSizing: 'border-box' as const
};

export function AddPlaylistItem({
  onSubmit,
  onCancel,
  isLoading = false
}: AddPlaylistItemProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [metadata, setMetadata] = useState<MetadataPreview | null>(null);
  const [musicType, setMusicType] = useState('audio');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

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

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setMetadata(null);
    setError(null);
  };

  const handleFetchMetadata = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('URLを入力してください。');
      return;
    }

    if (!parseTrackUrl(trimmedUrl)) {
      setError('現在登録できるのは YouTube と SoundCloud のURLのみです。');
      return;
    }

    await extractMetadata(trimmedUrl);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('URLを入力してください。');
      return;
    }

    if (!parseTrackUrl(trimmedUrl)) {
      setError('現在登録できるのは YouTube と SoundCloud のURLのみです。');
      return;
    }

    if (!metadata) {
      setError('URLの確認をしてください。');
      return;
    }

    try {
      await onSubmit({
        externalUrl: trimmedUrl,
        musicType,
        title: title.trim() || undefined
      });

      setUrl('');
      setTitle('');
      setMetadata(null);
      setMusicType('audio');
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
        onClick={(event) => event.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
          曲を追加する
        </h2>
        <p style={{ marginTop: '-12px', marginBottom: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
          YouTube / SoundCloud のURLを貼って、自分だけのプレイリストを作れます。
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              YouTube / SoundCloud URL
            </label>
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=... または https://soundcloud.com/artist/track"
              style={fieldStyle}
              disabled={isLoading || isLoadingMetadata}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              曲名（任意）
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="未入力の場合は仮タイトルを使います"
              style={fieldStyle}
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
                opacity: isLoading || isLoadingMetadata ? 0.6 : 1
              }}
            >
              {isLoadingMetadata ? '確認中...' : 'URLを確認する'}
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
                    style={{ width: '100%', borderRadius: '6px', marginBottom: '12px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
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
                  marginBottom: '16px'
                }}
              >
                別のURLを試す
              </button>
            </div>
          )}

          {metadata && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
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
                    fontWeight: 600
                  }}
                >
                  音源
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
                    fontWeight: 600
                  }}
                >
                  動画
                </button>
              </div>
            </div>
          )}

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
                opacity: isLoading ? 0.6 : 1
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
                opacity: isLoading || !metadata ? 0.6 : 1
              }}
            >
              {isLoading ? '追加中...' : '＋ プレイリストに追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
