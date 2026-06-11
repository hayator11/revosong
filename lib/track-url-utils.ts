export type TrackProvider = 'youtube' | 'soundcloud';

export type ParsedTrackUrl = {
  provider: TrackProvider;
  originalUrl: string;
  providerTrackId?: string;
  embedUrl: string;
};

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
  /(?:music\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
];

function normalizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

function getYouTubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function parseTrackUrl(url: string): ParsedTrackUrl | null {
  const originalUrl = normalizeUrl(url);
  if (!originalUrl) return null;

  const lowerUrl = originalUrl.toLowerCase();
  const videoId = getYouTubeVideoId(originalUrl);
  if (videoId) {
    return {
      provider: 'youtube',
      originalUrl,
      providerTrackId: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1`
    };
  }

  if (lowerUrl.includes('soundcloud.com') || lowerUrl.includes('on.soundcloud.com')) {
    return {
      provider: 'soundcloud',
      originalUrl,
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(originalUrl)}`
    };
  }

  return null;
}

export function isSupportedTrackUrl(url: string): boolean {
  return parseTrackUrl(url) !== null;
}

export function isContinuousPlayableProvider(provider: string): boolean {
  return provider === 'youtube' || provider === 'soundcloud';
}
