'use client';

import { ReactNode } from 'react';

/**
 * Utility Functions for URL Detection
 */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function isSoundCloudUrl(url: string): boolean {
  return url.includes('soundcloud.com');
}

export function isSunoUrl(url: string): boolean {
  return url.includes('suno.com');
}

export function isMurekaUrl(url: string): boolean {
  return url.includes('mureka.ai') || url.includes('mureka.ai/');
}

export function getNiconicoId(url: string): string | null {
  const m = url.match(/(?:nicovideo\.jp\/watch\/|nico\.ms\/)(sm\d+)/);
  return m ? m[1] : null;
}

export function getSpotifyId(url: string): { type: string; id: string } | null {
  const m = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (m) return { type: m[1], id: m[2] };
  return null;
}

export function getServiceName(url: string): string {
  if (getYouTubeId(url)) return 'YouTube';
  if (isSoundCloudUrl(url)) return 'SoundCloud';
  if (isSunoUrl(url)) return 'SUNO';
  if (isMurekaUrl(url)) return 'Mureka';
  if (getNiconicoId(url)) return 'ニコニコ動画';
  if (getSpotifyId(url)) return 'Spotify';
  if (url.includes('bandcamp.com')) return 'Bandcamp';
  if (url.includes('audiomack.com')) return 'Audiomack';
  return '外部サイト';
}

/**
 * EmbedPlayer Component
 * Renders the appropriate embed for various music streaming services
 */
interface EmbedPlayerProps {
  url: string;
  autoplay?: boolean;
  height?: number;
}

export function EmbedPlayer({
  url,
  autoplay = true,
  height
}: EmbedPlayerProps): ReactNode {
  const ytId = getYouTubeId(url);
  if (ytId) {
    // enablejsapi=1 is required for postMessage-based end-of-video detection
    return (
      <iframe
        width="100%"
        height={height || 160}
        src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1${autoplay ? '&autoplay=1' : ''}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  if (isSoundCloudUrl(url)) {
    const encoded = encodeURIComponent(url);
    return (
      <iframe
        width="100%"
        height={height || 120}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encoded}&auto_play=${autoplay ? 'true' : 'false'}&color=%23ff2d55&hide_related=true&show_comments=false&show_user=true&show_reposts=false`}
        style={{ borderRadius: 12 }}
      />
    );
  }

  const nicoId = getNiconicoId(url);
  if (nicoId) {
    return (
      <iframe
        width="100%"
        height={height || 170}
        src={`https://embed.nicovideo.jp/watch/${nicoId}`}
        style={{ border: 'none', borderRadius: 12 }}
        allowFullScreen
      />
    );
  }

  const spotify = getSpotifyId(url);
  if (spotify) {
    return (
      <iframe
        width="100%"
        height={height || 152}
        src={`https://open.spotify.com/embed/${spotify.type}/${spotify.id}?theme=0`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  if (url.includes('bandcamp.com')) {
    return (
      <div style={{ borderRadius: 12, overflow: 'hidden' }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#1da0c3',
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 24 }}>🎵</span>
          <div>
            <div style={{ fontWeight: 700 }}>Bandcampで再生</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              タップして開く
            </div>
          </div>
        </a>
      </div>
    );
  }

  if (url.includes('audiomack.com')) {
    const encoded = encodeURIComponent(url);
    return (
      <iframe
        width="100%"
        height={height || 150}
        src={`https://audiomack.com/embed/song?url=${encoded}&background=1`}
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  if (isSunoUrl(url)) {
    return (
      <iframe
        width="100%"
        height={height || 120}
        src={url}
        allow="autoplay; encrypted-media"
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  if (isMurekaUrl(url)) {
    return (
      <iframe
        width="100%"
        height={height || 120}
        src={url}
        allow="autoplay; encrypted-media"
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '16px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#ff2d55',
        textAlign: 'center',
        textDecoration: 'none',
        fontSize: 14,
      }}
    >
      外部サイトで再生する
    </a>
  );
}
