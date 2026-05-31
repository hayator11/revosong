/**
 * Playlist Utility Functions
 * Helper functions for service detection, metadata extraction, and URL parsing
 */

export type SupportedService = 'youtube' | 'spotify' | 'soundcloud' | 'niconico' | 'bandcamp' | 'audiomack' | 'suno' | 'mureka';
export type MusicType = 'audio' | 'video';

export interface ExtractedMetadata {
  service: SupportedService;
  title: string;
  artist?: string;
  thumbnail_url?: string;
  duration?: string;
}

// ============================================================================
// Service Detection
// ============================================================================

/**
 * Detect which service a URL belongs to
 */
export function detectService(url: string): SupportedService | null {
  try {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'youtube';
    }
    if (lowerUrl.includes('spotify.com')) {
      return 'spotify';
    }
    if (lowerUrl.includes('soundcloud.com')) {
      return 'soundcloud';
    }
    if (lowerUrl.includes('nicovideo.jp') || lowerUrl.includes('nico.ms')) {
      return 'niconico';
    }
    if (lowerUrl.includes('bandcamp.com')) {
      return 'bandcamp';
    }
    if (lowerUrl.includes('audiomack.com')) {
      return 'audiomack';
    }
    if (lowerUrl.includes('suno.com')) {
      return 'suno';
    }
    if (lowerUrl.includes('mureka.ai')) {
      return 'mureka';
    }

    return null;
  } catch (error) {
    return null;
  }
}

// ============================================================================
// URL Parsing - Service Specific
// ============================================================================

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Spotify ID and type from URL
 */
export function extractSpotifyId(url: string): { id: string; type: 'track' | 'album' | 'playlist' } | null {
  const patterns = [
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && (match[1] === 'track' || match[1] === 'album' || match[1] === 'playlist')) {
      return { type: match[1] as 'track' | 'album' | 'playlist', id: match[2] };
    }
  }
  return null;
}

/**
 * Extract SoundCloud URL info
 */
export function extractSoundCloudUrl(url: string): string | null {
  if (url.includes('soundcloud.com')) {
    return url;
  }
  return null;
}

/**
 * Extract Niconico video ID
 */
export function extractNiconicoId(url: string): string | null {
  const patterns = [
    /(?:nicovideo\.jp|nico\.ms)\/watch\/(sm\d+)/,
    /nicovideo\.jp\/watch\/(sm\d+)/,
    /nico\.ms\/(sm\d+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Bandcamp artist/album/track info
 */
export function extractBandcampInfo(url: string): { artist: string; item: string; type: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p && !p.includes('?'));

    // Format: /artist/album or /artist/track/tracktitle
    if (pathParts.length >= 2) {
      return {
        artist: pathParts[0],
        item: pathParts.slice(1).join('/'),
        type: pathParts[1]
      };
    }
  } catch (error) {
    // URL parsing error
  }
  return null;
}

/**
 * Extract Audiomack artist/album/song info
 */
export function extractAudiomackInfo(url: string): { artist: string; item: string; type: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p && !p.includes('?'));

    // Format: /artist/album or /artist/song
    if (pathParts.length >= 2) {
      return {
        artist: pathParts[0],
        item: pathParts[1],
        type: pathParts[1] === 'album' ? 'album' : 'song'
      };
    }
  } catch (error) {
    // URL parsing error
  }
  return null;
}

// ============================================================================
// Music Type Detection
// ============================================================================

/**
 * Detect music type (audio/video) based on service
 * This provides a sensible default but can be overridden by user
 */
export function detectMusicType(service: SupportedService, url?: string): MusicType {
  // Services that are primarily video
  if (service === 'youtube' || service === 'niconico') {
    return 'video';
  }

  // Services that are primarily audio
  if (
    service === 'spotify' ||
    service === 'soundcloud' ||
    service === 'bandcamp' ||
    service === 'audiomack' ||
    service === 'suno' ||
    service === 'mureka'
  ) {
    return 'audio';
  }

  // Default to audio
  return 'audio';
}

// ============================================================================
// Thumbnail URL Generation
// ============================================================================

/**
 * Generate thumbnail URL for a service without API calls
 * Some services require actual API calls; this provides sensible defaults
 */
export function generateThumbnailUrl(service: SupportedService, identifier: string): string | null {
  switch (service) {
    case 'youtube': {
      // YouTube provides direct thumbnail URLs
      return `https://img.youtube.com/vi/${identifier}/hqdefault.jpg`;
    }
    case 'niconico': {
      // Niconico format
      return `https://nico.ms/watch/${identifier}`;
    }
    case 'spotify': {
      // Spotify doesn't provide simple thumbnails without API
      return null;
    }
    case 'soundcloud': {
      // SoundCloud doesn't provide simple thumbnails without API
      return null;
    }
    case 'bandcamp': {
      // Bandcamp doesn't provide simple thumbnails without API
      return null;
    }
    case 'audiomack': {
      // Audiomack doesn't provide simple thumbnails without API
      return null;
    }
    case 'suno':
    case 'mureka': {
      return null;
    }
    default:
      return null;
  }
}

// ============================================================================
// Title/Artist Parsing
// ============================================================================

/**
 * Parse title and artist from URL for services that don't provide metadata
 */
export function parseDefaultMetadata(service: SupportedService, url: string): { title: string; artist?: string } {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p && !p.includes('?'));

    // Remove query parameters and decode
    let lastPart = pathParts[pathParts.length - 1] || '';
    lastPart = decodeURIComponent(lastPart).replace(/[-_]/g, ' ');

    switch (service) {
      case 'bandcamp': {
        return {
          title: lastPart,
          artist: pathParts[0] || 'Unknown'
        };
      }
      case 'audiomack': {
        return {
          title: lastPart,
          artist: pathParts[0] || 'Unknown'
        };
      }
      default: {
        return {
          title: lastPart || 'Unknown'
        };
      }
    }
  } catch (error) {
    return {
      title: 'Unknown'
    };
  }
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate a URL belongs to a supported service
 */
export function isValidPlaylistUrl(url: string): boolean {
  return isValidUrl(url) && detectService(url) !== null;
}

/**
 * Validate music type value
 */
export function isValidMusicType(value: unknown): value is MusicType {
  return value === 'audio' || value === 'video';
}

// ============================================================================
// Client-side fetch helper
// ============================================================================

/**
 * Fetch metadata from the extract-metadata API endpoint
 * Use this on the client side to get metadata before adding to playlist
 */
export async function fetchMetadataFromApi(url: string, token?: string): Promise<ExtractedMetadata> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/extract-metadata', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch metadata');
    }

    return await response.json();
  } catch (error) {
    // If API call fails, return basic defaults
    const service = detectService(url);
    if (!service) {
      throw new Error('Unsupported URL service');
    }

    return {
      service,
      ...parseDefaultMetadata(service, url)
    };
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is a valid SupportedService
 */
export function isSupportedService(value: unknown): value is SupportedService {
  return value === 'youtube' ||
    value === 'spotify' ||
    value === 'soundcloud' ||
    value === 'niconico' ||
    value === 'bandcamp' ||
    value === 'audiomack' ||
    value === 'suno' ||
    value === 'mureka';
}

// ============================================================================
// Export constants
// ============================================================================

export const SUPPORTED_SERVICES: Record<SupportedService, string> = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  niconico: 'Niconico',
  bandcamp: 'Bandcamp',
  audiomack: 'Audiomack',
  suno: 'SUNO',
  mureka: 'Mureka'
};

export const SERVICE_COLORS: Record<SupportedService, string> = {
  youtube: '#ff0000',
  spotify: '#1DB954',
  soundcloud: '#ff7700',
  niconico: '#131621',
  bandcamp: '#1ea0c3',
  audiomack: '#ff0000',
  suno: '#7c3aed',
  mureka: '#00b8a9'
};
