import { NextRequest, NextResponse } from 'next/server';

interface ExtractMetadataRequest {
  url: string;
}

interface ExtractedMetadata {
  service: string;
  title: string;
  artist?: string;
  thumbnail_url?: string;
  duration?: string;
}

// Helper function to detect service from URL
function detectService(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('nicovideo.jp') || url.includes('nico.ms')) return 'niconico';
  if (url.includes('bandcamp.com')) return 'bandcamp';
  if (url.includes('audiomack.com')) return 'audiomack';
  return 'unknown';
}

// Extract video ID from YouTube URLs
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract Spotify track/album/playlist ID
function extractSpotifyId(url: string): { id: string; type: string } | null {
  const patterns = [
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: match[1], id: match[2] };
    }
  }
  return null;
}

// Extract SoundCloud URL info
function extractSoundCloudInfo(url: string): string | null {
  // SoundCloud URLs should be used directly with oEmbed
  if (url.includes('soundcloud.com')) {
    return url;
  }
  return null;
}

// Extract Niconico video ID
function extractNiconicoId(url: string): string | null {
  const match = url.match(/(?:nicovideo\.jp|nico\.ms)\/watch\/(sm\d+)/);
  return match ? match[1] : null;
}

// Fetch YouTube metadata via oEmbed
async function fetchYouTubeMetadata(videoId: string): Promise<Partial<ExtractedMetadata>> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    return {
      title: data.title || 'Unknown Video',
      thumbnail_url: data.thumbnail_url || null,
      artist: data.author_name || null
    };
  } catch (error) {
    console.error('YouTube oEmbed error:', error);
    return {
      title: 'YouTube Video',
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/default.jpg`
    };
  }
}

// Fetch SoundCloud metadata via oEmbed
async function fetchSoundCloudMetadata(url: string): Promise<Partial<ExtractedMetadata>> {
  try {
    const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      console.error(`SoundCloud oEmbed error: ${response.status}`);
      return { title: 'SoundCloud Track' };
    }

    const text = await response.text();
    if (!text) {
      console.error('SoundCloud oEmbed returned empty response');
      return { title: 'SoundCloud Track' };
    }

    const data = JSON.parse(text);

    // Extract thumbnail from HTML response (SoundCloud includes it in the HTML)
    let thumbnailUrl: string | null = null;
    if (data.html) {
      const match = data.html.match(/https:\/\/i1\.sndcdn\.com\/[^"]+/);
      if (match) {
        thumbnailUrl = match[0];
      }
    }

    return {
      title: data.title || 'Unknown Track',
      artist: data.author_name || null,
      thumbnail_url: thumbnailUrl || data.thumbnail_url || null
    };
  } catch (error) {
    console.error('SoundCloud oEmbed error:', error);
    return {
      title: 'SoundCloud Track'
    };
  }
}

// Fetch Spotify metadata (basic parsing without API)
function parseSpotifyMetadata(spotifyId: { id: string; type: string }): Partial<ExtractedMetadata> {
  // For Spotify, we can generate a thumbnail URL pattern
  // Actual metadata would require Spotify API
  const thumbnailMap: Record<string, string> = {
    track: 'https://open.spotify.com/embed?uri=spotify:track:',
    album: 'https://open.spotify.com/embed?uri=spotify:album:',
    playlist: 'https://open.spotify.com/embed?uri=spotify:playlist:'
  };

  return {
    title: `Spotify ${spotifyId.type}`,
    thumbnail_url: undefined // Would need API token for actual thumbnail
  };
}

// Fetch Niconico metadata (basic parsing)
async function fetchNiconicoMetadata(videoId: string): Promise<Partial<ExtractedMetadata>> {
  try {
    // Niconico doesn't expose easy oEmbed, so we provide defaults
    return {
      title: `Niconico Video (${videoId})`,
      thumbnail_url: `https://nico.ms/watch/${videoId}`
    };
  } catch (error) {
    console.error('Niconico fetch error:', error);
    return {
      title: 'Niconico Video'
    };
  }
}

// Parse Bandcamp URL metadata
async function fetchBandcampMetadata(url: string): Promise<Partial<ExtractedMetadata>> {
  try {
    // Bandcamp URLs can be parsed for basic info
    // Format: bandcamp.com/artist/album or bandcamp.com/track/song
    const parts = url.split('/').filter(p => p && !p.includes('?'));
    const title = parts[parts.length - 1]?.replace(/-/g, ' ') || 'Bandcamp Track';

    return {
      title: title,
      thumbnail_url: undefined
    };
  } catch (error) {
    console.error('Bandcamp parse error:', error);
    return {
      title: 'Bandcamp Track'
    };
  }
}

// Parse Audiomack URL metadata
async function fetchAudiomackMetadata(url: string): Promise<Partial<ExtractedMetadata>> {
  try {
    // Audiomack URLs format: audiomack.com/artist/album or /song
    const parts = url.split('/').filter(p => p && !p.includes('?'));
    const title = parts[parts.length - 1]?.replace(/-/g, ' ') || 'Audiomack Track';

    return {
      title: title,
      thumbnail_url: undefined
    };
  } catch (error) {
    console.error('Audiomack parse error:', error);
    return {
      title: 'Audiomack Track'
    };
  }
}

// POST /api/extract-metadata - Extract metadata from external URL
export async function POST(request: NextRequest) {
  try {
    // Get current user (optional for this endpoint, but good to track)
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      // We could check user here if needed, but allow unauthenticated requests for URL metadata
    }

    // Parse request body
    const body: ExtractMetadataRequest = await request.json();

    if (!body.url || typeof body.url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const service = detectService(body.url);

    let metadata: Partial<ExtractedMetadata> = {
      service,
      title: 'Unknown',
    };

    // Service-specific metadata extraction
    switch (service) {
      case 'youtube': {
        const videoId = extractYouTubeId(body.url);
        if (videoId) {
          metadata = { ...metadata, ...(await fetchYouTubeMetadata(videoId)) };
        }
        break;
      }

      case 'soundcloud': {
        metadata = { ...metadata, ...(await fetchSoundCloudMetadata(body.url)) };
        break;
      }

      case 'spotify': {
        const spotifyId = extractSpotifyId(body.url);
        if (spotifyId) {
          metadata = { ...metadata, ...parseSpotifyMetadata(spotifyId) };
        }
        break;
      }

      case 'niconico': {
        const niconicoId = extractNiconicoId(body.url);
        if (niconicoId) {
          metadata = { ...metadata, ...(await fetchNiconicoMetadata(niconicoId)) };
        }
        break;
      }

      case 'bandcamp': {
        metadata = { ...metadata, ...(await fetchBandcampMetadata(body.url)) };
        break;
      }

      case 'audiomack': {
        metadata = { ...metadata, ...(await fetchAudiomackMetadata(body.url)) };
        break;
      }

      default: {
        return NextResponse.json(
          { error: 'Unsupported URL service' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(metadata as ExtractedMetadata);
  } catch (error) {
    console.error('Extract metadata error:', error);
    return NextResponse.json(
      { error: 'Failed to extract metadata' },
      { status: 500 }
    );
  }
}
