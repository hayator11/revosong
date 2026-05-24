'use client';

import { useState, useEffect } from 'react';
import { EmbedPlayer } from './EmbedPlayer';

interface PlaylistItem {
  id: number;
  playlist_id: number;
  track_id?: number;
  external_url?: string;
  external_title?: string;
  external_artist?: string;
  external_thumbnail_url?: string;
  external_service?: string;
  music_type?: string;
  order_index: number;
  added_at: string;
  title?: string;
  artist_name?: string;
  photo_url?: string;
}

interface PlaylistPlayerProps {
  items: PlaylistItem[];
  playlistTitle: string;
}

export function PlaylistPlayer({
  items,
  playlistTitle
}: PlaylistPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  useEffect(() => {
    if (shuffle) {
      const indices = Array.from({ length: items.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    } else {
      setShuffledIndices([]);
    }
  }, [shuffle, items.length]);

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}
      >
        プレイリストは空です
      </div>
    );
  }

  const displayIndex = shuffle ? shuffledIndices[currentIndex] : currentIndex;
  const currentItem = items[displayIndex];

  const handleNext = () => {
    if (shuffle) {
      if (currentIndex < shuffledIndices.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (repeat === 'all') {
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (repeat === 'all') {
        setCurrentIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (repeat === 'all') {
      setCurrentIndex(shuffle ? shuffledIndices.length - 1 : items.length - 1);
    }
  };

  const handleJumpToTrack = (index: number) => {
    setCurrentIndex(index);
  };

  const title = currentItem.external_title || currentItem.title || '無題';
  const artist = currentItem.external_artist || currentItem.artist_name || '不明';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '20px',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      } as any}
    >
      {/* Main Player */}
      <div>
        <div
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(255, 45, 85, 0.1) 0%, rgba(100, 150, 255, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
              {currentIndex + 1} / {items.length}
            </div>
            <h3
              style={{
                marginTop: 0,
                marginBottom: '4px',
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff'
              }}
            >
              {title}
            </h3>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              {artist}
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              marginBottom: '20px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#ff2d55',
                width: `${((currentIndex + 1) / items.length) * 100}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShuffle(!shuffle)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: shuffle ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="シャッフル"
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '1';
                }}
              >
                🔀
              </button>

              <button
                onClick={handlePrevious}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="前へ"
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                ⏮️
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ff2d55',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title={isPlaying ? '一時停止' : '再生'}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '1';
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <button
                onClick={handleNext}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="次へ"
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                ⏭️
              </button>

              <button
                onClick={() => {
                  if (repeat === 'off') setRepeat('all');
                  else if (repeat === 'all') setRepeat('one');
                  else setRepeat('off');
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: repeat !== 'off' ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                title="リピート"
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.opacity = '1';
                }}
              >
                🔁
                {repeat === 'one' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      fontSize: '10px',
                      background: '#ff2d55',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    1
                  </span>
                )}
              </button>
            </div>

            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              {currentItem.music_type === 'video' ? '🎬 動画' : '🎵 音源'}
            </div>
          </div>
        </div>

        {/* Embed Player */}
        {currentItem.external_url ? (
          <EmbedPlayer url={currentItem.external_url} autoplay={isPlaying} />
        ) : currentItem.track_id ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textAlign: 'center' }}>
            REVOSONG楽曲の再生機能は近日対応予定
          </div>
        ) : null}
      </div>

      {/* Queue Sidebar */}
      <div
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}
      >
        <h4
          style={{
            marginTop: 0,
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff'
          }}
        >
          キュー ({items.length})
        </h4>

        {items.map((item, index) => {
          const isCurrentItem = displayIndex === index;
          const itemTitle = item.external_title || item.title || '無題';

          return (
            <button
              key={item.id}
              onClick={() => handleJumpToTrack(index)}
              style={{
                width: '100%',
                padding: '8px 12px',
                marginBottom: '6px',
                background: isCurrentItem
                  ? '#ff2d55'
                  : 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                transition: 'all 0.2s',
                opacity: isCurrentItem ? 1 : 0.7,
                fontWeight: isCurrentItem ? 600 : 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isCurrentItem) {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.12)';
                  (e.target as HTMLButtonElement).style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentItem) {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                  (e.target as HTMLButtonElement).style.opacity = '0.7';
                }
              }}
            >
              {isCurrentItem && '▶ '}
              {index + 1}. {itemTitle}
            </button>
          );
        })}
      </div>
    </div>
  );
}
