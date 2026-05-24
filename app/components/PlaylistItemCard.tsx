'use client';

import { useState } from 'react';

interface PlaylistItem {
  id: number;
  playlist_id: number;
  track_id?: number | null;
  external_url?: string | null;
  external_title?: string | null;
  external_artist?: string | null;
  external_thumbnail_url?: string | null;
  external_service?: string | null;
  music_type?: string;
  order_index: number;
  added_at: string;
  // Extended info from joined views
  title?: string;
  artist_name?: string;
  photo_url?: string | null;
}

interface PlaylistItemCardProps {
  item: PlaylistItem;
  onDelete?: (itemId: number) => void;
  onEdit?: (item: PlaylistItem) => void;
  isDragging?: boolean;
  dragHandle?: React.ReactNode;
  onPlay?: (item: PlaylistItem) => void;
}

export function PlaylistItemCard({
  item,
  onDelete,
  onEdit,
  isDragging = false,
  dragHandle,
  onPlay
}: PlaylistItemCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const thumbnail = item.external_thumbnail_url || item.photo_url;
  const title = item.external_title || item.title || '無題';
  const artist = item.external_artist || item.artist_name || '不明';
  const source = item.external_service || (item.track_id ? 'REVOSONG' : '外部');
  const musicType = item.music_type || 'audio';

  const getServiceColor = (service?: string) => {
    const colors: Record<string, string> = {
      youtube: '#ff0000',
      spotify: '#1DB954',
      soundcloud: '#ff5500',
      niconico: '#000000',
      bandcamp: '#1da0c3',
      audiomack: '#ff3500',
      REVOSONG: '#ff2d55'
    };
    return colors[service?.toLowerCase() || 'REVOSONG'] || '#666';
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        background: isDragging
          ? 'rgba(255, 45, 85, 0.2)'
          : isHovering
            ? 'rgba(255, 255, 255, 0.08)'
            : 'transparent',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
        cursor: isDragging ? 'grabbing' : 'default',
        opacity: isDragging ? 0.6 : 1
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Drag Handle */}
      {dragHandle && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'grab',
          color: 'rgba(255, 255, 255, 0.4)',
          userSelect: 'none'
        }}>
          {dragHandle}
        </div>
      )}

      {/* Thumbnail */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '6px',
            objectFit: 'cover',
            flexShrink: 0
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '4px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {artist}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Service Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: getServiceColor(source),
              color: '#fff',
              opacity: 0.8
            }}
          >
            {source}
          </span>

          {/* Music Type Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              backgroundColor: musicType === 'video' ? 'rgba(255, 100, 100, 0.6)' : 'rgba(100, 150, 255, 0.6)',
              color: '#fff'
            }}
          >
            {musicType === 'video' ? '🎬 動画' : '🎵 音源'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {isHovering && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {onPlay && (
            <button
              onClick={() => onPlay(item)}
              style={{
                padding: '6px 12px',
                background: '#ff2d55',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '1';
              }}
            >
              再生
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              style={{
                padding: '6px 12px',
                background: 'rgba(100, 150, 255, 0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '1';
              }}
            >
              編集
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (confirm('このアイテムを削除しますか？')) {
                  onDelete(item.id);
                }
              }}
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 100, 100, 0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '1';
              }}
            >
              削除
            </button>
          )}
        </div>
      )}
    </div>
  );
}
