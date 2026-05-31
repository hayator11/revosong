'use client';

import { ReactNode, useEffect, useId, useRef, useState } from 'react';

type SoundCloudWidget = {
  bind: (eventName: string, callback: () => void) => void;
  unbind: (eventName: string) => void;
};

type SoundCloudApi = {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: {
      FINISH: string;
      PLAY: string;
    };
  };
};

declare global {
  interface Window {
    SC?: SoundCloudApi;
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
  onAutoplayBlocked?: () => void;
  replaySignal?: number;
}

const SOUNDCLOUD_API_SRC = 'https://w.soundcloud.com/player/api.js';
const YOUTUBE_STATE = {
  ENDED: 0,
  PLAYING: 1,
  BUFFERING: 3
} as const;

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

function hasEndedMessage(data: unknown): boolean {
  return typeof data === 'string' && /ended|finish/i.test(data);
}

function parseMessageData(data: unknown): unknown {
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function getYouTubeMessageState(data: unknown): number | null {
  const parsed = parseMessageData(data);
  if (!parsed || typeof parsed !== 'object') return null;

  const record = parsed as Record<string, unknown>;
  if (record.event !== 'onStateChange') return null;

  if (typeof record.info === 'number') {
    return record.info;
  }

  if (typeof record.info === 'string') {
    const state = Number(record.info);
    return Number.isNaN(state) ? null : state;
  }

  return null;
}

function sendYouTubeCommand(
  iframe: HTMLIFrameElement | null,
  func: string,
  args: unknown[] = []
): void {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({
      event: 'command',
      func,
      args
    }),
    'https://www.youtube.com'
  );
}

export function EmbedPlayer({
  url,
  autoplay = true,
  height,
  onEnded,
  onAutoplayBlocked,
  replaySignal = 0
}: EmbedPlayerProps): ReactNode {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const endedRef = useRef(false);
  const onEndedRef = useRef<(() => void) | undefined>(undefined);
  const hasStartedRef = useRef(false);
  const currentYouTubeIdRef = useRef<string | null>(getYouTubeId(url));
  const previousReplaySignalRef = useRef(replaySignal);
  const [youTubeIframeId] = useState(() => getYouTubeId(url));
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
    hasStartedRef.current = false;
  }, [url]);

  useEffect(() => {
    const ytId = getYouTubeId(url);
    if (!ytId || !iframeRef.current) return;

    const shouldLoad =
      currentYouTubeIdRef.current !== ytId ||
      previousReplaySignalRef.current !== replaySignal;

    currentYouTubeIdRef.current = ytId;
    previousReplaySignalRef.current = replaySignal;
    endedRef.current = false;
    hasStartedRef.current = false;

    if (!shouldLoad) return;

    sendYouTubeCommand(
      iframeRef.current,
      autoplay ? 'loadVideoById' : 'cueVideoById',
      [ytId]
    );
  }, [autoplay, replaySignal, url]);

  useEffect(() => {
    if (!getYouTubeId(url) || !iframeRef.current) return;

    sendYouTubeCommand(iframeRef.current, autoplay ? 'playVideo' : 'pauseVideo');
  }, [autoplay, url]);

  useEffect(() => {
    const notifyEnded = () => {
      if (endedRef.current) return;
      endedRef.current = true;
      onEndedRef.current?.();
    };

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      if (getYouTubeId(url)) {
        const handleMessage = (event: MessageEvent) => {
          if (event.source !== iframeRef.current?.contentWindow) return;

          const state = getYouTubeMessageState(event.data);
          if (state === null) return;

          if (state === YOUTUBE_STATE.PLAYING || state === YOUTUBE_STATE.BUFFERING) {
            hasStartedRef.current = true;
            endedRef.current = false;
            return;
          }

          if (state === YOUTUBE_STATE.ENDED && hasStartedRef.current) {
            notifyEnded();
          }
        };

        window.addEventListener('message', handleMessage);
        sendYouTubeCommand(iframeRef.current, 'addEventListener', ['onStateChange']);
        cleanup = () => window.removeEventListener('message', handleMessage);
        return;
      }

      if (isSoundCloudUrl(url)) {
        try {
          await loadExternalScript(SOUNDCLOUD_API_SRC);
          if (cancelled || !iframeRef.current || !window.SC?.Widget) return;

          const widget = window.SC.Widget(iframeRef.current);
          const finishEvent = window.SC.Widget.Events.FINISH;
          const playEvent = window.SC.Widget.Events.PLAY;
          const markStarted = () => {
            hasStartedRef.current = true;
            endedRef.current = false;
          };
          const handleFinish = () => {
            if (hasStartedRef.current) {
              notifyEnded();
            }
          };

          widget.bind(playEvent, markStarted);
          widget.bind(finishEvent, handleFinish);
          cleanup = () => {
            widget.unbind(playEvent);
            widget.unbind(finishEvent);
          };
        } catch {
          // SoundCloud finish events are best-effort; users can advance manually.
          onAutoplayBlocked?.();
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
      }
    };

    setup();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [onAutoplayBlocked, url]);

  const ytId = getYouTubeId(url);
  if (ytId) {
    const initialYtId = youTubeIframeId || ytId;

    return (
      <iframe
        ref={iframeRef}
        id={iframeId}
        width="100%"
        height={height || 160}
        src={`https://www.youtube.com/embed/${initialYtId}?enablejsapi=1&playsinline=1${pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : ''}${autoplay ? '&autoplay=1' : ''}`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          sendYouTubeCommand(iframeRef.current, 'addEventListener', ['onStateChange']);

          if (currentYouTubeIdRef.current && currentYouTubeIdRef.current !== initialYtId) {
            sendYouTubeCommand(
              iframeRef.current,
              autoplay ? 'loadVideoById' : 'cueVideoById',
              [currentYouTubeIdRef.current]
            );
          }
        }}
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
