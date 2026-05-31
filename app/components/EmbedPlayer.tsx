'use client';

import { ReactNode, useEffect, useId, useRef } from 'react';

type SoundCloudWidget = {
  bind: (eventName: string, callback: () => void) => void;
  unbind: (eventName: string) => void;
};

type SoundCloudApi = {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: {
      FINISH: string;
    };
  };
};

type YouTubeApi = {
  PlayerState: {
    ENDED: number;
  };
  Player: new (
    iframe: HTMLIFrameElement,
    config: {
      events: {
        onStateChange: (event: { data: number }) => void;
      };
    }
  ) => {
    destroy: () => void;
  };
};

declare global {
  interface Window {
    SC?: SoundCloudApi;
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
  onEnded?: () => void;
}

const YOUTUBE_API_SRC = 'https://www.youtube.com/iframe_api';
const SOUNDCLOUD_API_SRC = 'https://w.soundcloud.com/player/api.js';

function loadExternalScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    loadExternalScript(YOUTUBE_API_SRC).catch(reject);
  });
}

function hasEndedMessage(data: unknown): boolean {
  const values: unknown[] = [data];

  if (typeof data === 'string') {
    try {
      values.push(JSON.parse(data));
    } catch {
      // Some providers post plain text events.
    }
  }

  return values.some((value) => {
    if (!value) return false;

    if (typeof value === 'string') {
      return /ended|finish|finished|complete|completed/i.test(value);
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const eventText = [
        record.event,
        record.type,
        record.name,
        record.action,
        record.status,
        record.state
      ]
        .filter(Boolean)
        .join(' ');

      return /ended|finish|finished|complete|completed/i.test(eventText);
    }

    return false;
  });
}

function getFallbackEndDelay(url: string): number | null {
  if (isSunoUrl(url) || isMurekaUrl(url)) {
    return 4 * 60 * 1000;
  }

  return null;
}

export function EmbedPlayer({
  url,
  autoplay = true,
  height,
  onEnded
}: EmbedPlayerProps): ReactNode {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const endedRef = useRef(false);
  const onEndedRef = useRef<(() => void) | undefined>(undefined);
  const reactId = useId();
  const iframeId = `embed-player-${reactId.replace(/:/g, '')}`;
  const pageOrigin = typeof window === 'undefined' ? '' : window.location.origin;

  // Keep ref in sync without adding onEnded to the setup effect's deps.
  // This prevents the YouTube/SoundCloud player from being destroyed and recreated
  // every time the callback identity changes (e.g. useCallback re-create).
  useEffect(() => {
    onEndedRef.current = onEnded;
  });

  useEffect(() => {
    endedRef.current = false;

    const notifyEnded = () => {
      if (endedRef.current) return;
      endedRef.current = true;
      onEndedRef.current?.();
    };

    let cleanup: (() => void) | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const setup = async () => {
      if (getYouTubeId(url)) {
        try {
          await loadYouTubeApi();
          if (cancelled || !iframeRef.current || !window.YT?.Player) return;
          const youTubeApi = window.YT;

          const player = new youTubeApi.Player(iframeRef.current, {
            events: {
              onStateChange: (event: { data: number }) => {
                if (event.data === youTubeApi.PlayerState.ENDED) {
                  notifyEnded();
                }
              }
            }
          });

          cleanup = () => {
            try {
              player.destroy();
            } catch {
              // The iframe may already be gone during route changes.
            }
          };
        } catch {
          // If the API is blocked, the player still renders; ending just cannot be observed.
        }
        return;
      }

      if (isSoundCloudUrl(url)) {
        try {
          await loadExternalScript(SOUNDCLOUD_API_SRC);
          if (cancelled || !iframeRef.current || !window.SC?.Widget) return;

          const widget = window.SC.Widget(iframeRef.current);
          const finishEvent = window.SC.Widget.Events.FINISH;
          widget.bind(finishEvent, notifyEnded);
          cleanup = () => widget.unbind(finishEvent);
        } catch {
          fallbackTimer = setTimeout(notifyEnded, 4 * 60 * 1000);
        }
        return;
      }

      if (isSunoUrl(url) || isMurekaUrl(url)) {
        const handleMessage = (event: MessageEvent) => {
          if (event.source === iframeRef.current?.contentWindow && hasEndedMessage(event.data)) {
            notifyEnded();
          }
        };

        window.addEventListener('message', handleMessage);
        cleanup = () => window.removeEventListener('message', handleMessage);

        const fallbackDelay = getFallbackEndDelay(url);
        if (fallbackDelay) {
          fallbackTimer = setTimeout(notifyEnded, fallbackDelay);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      cleanup?.();
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  // onEnded は ref 経由でアクセスするため依存配列から除外。url 変更時のみ再セットアップ。
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <iframe
        ref={iframeRef}
        id={iframeId}
        width="100%"
        height={height || 160}
        src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&playsinline=1${pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : ''}${autoplay ? '&autoplay=1' : ''}`}
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
        ref={iframeRef}
        id={iframeId}
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
        ref={iframeRef}
        id={iframeId}
        width="100%"
        height={height || 120}
        src={autoplay ? `${url}${url.includes('?') ? '&' : '?'}autoplay=1` : url}
        allow="autoplay; encrypted-media"
        style={{ border: 'none', borderRadius: 12 }}
      />
    );
  }

  if (isMurekaUrl(url)) {
    return (
      <iframe
        ref={iframeRef}
        id={iframeId}
        width="100%"
        height={height || 120}
        src={autoplay ? `${url}${url.includes('?') ? '&' : '?'}autoplay=1` : url}
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
