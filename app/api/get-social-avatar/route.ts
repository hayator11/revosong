import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract SNS username/handle from URL
 */
function extractSNSUsername(url: string, platform: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();

    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        const xMatch = pathname.match(/^\/([a-zA-Z0-9_]+)/?$/);
        return xMatch ? xMatch[1] : null;

      case 'instagram':
        const igMatch = pathname.match(/^\/([a-zA-Z0-9_.]+)/?$/);
        return igMatch ? igMatch[1] : null;

      case 'youtube':
        const ytMatch = pathname.match(/^\/(@[a-zA-Z0-9_-]+)/?$/);
        return ytMatch ? ytMatch[1] : null;

      case 'tiktok':
        const ttMatch = pathname.match(/^\/(@[a-zA-Z0-9_.]+)/?$/);
        return ttMatch ? ttMatch[1] : null;

      case 'facebook':
        const fbMatch = pathname.match(/^\/([a-zA-Z0-9.]+)/?$/);
        return fbMatch ? fbMatch[1] : null;

      case 'threads':
        const thMatch = pathname.match(/^\/(@[a-zA-Z0-9_.]+)/?$/);
        return thMatch ? thMatch[1] : null;

      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Get profile avatar from SNS platform using unavatar.io
 */
function getSocialAvatarUrl(url: string, platform: string): string | null {
  try {
    const username = extractSNSUsername(url, platform);
    if (!username) return null;

    const cleanUsername = username.replace('@', '');

    // unavatar.io service - simple and reliable
    // Format: https://unavatar.io/[service]/[username]
    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        return `https://unavatar.io/twitter/${cleanUsername}`;
      case 'instagram':
        return `https://unavatar.io/instagram/${cleanUsername}`;
      case 'youtube':
        return `https://unavatar.io/youtube/${cleanUsername}`;
      case 'tiktok':
        return `https://unavatar.io/tiktok/${cleanUsername}`;
      case 'facebook':
        return `https://unavatar.io/facebook/${cleanUsername}`;
      case 'threads':
        // Threads not well supported by unavatar.io yet
        return null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, platform } = await request.json();

    if (!url || !platform) {
      return NextResponse.json(
        { avatarUrl: null }
      );
    }

    const avatarUrl = getSocialAvatarUrl(url, platform);

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error('Error getting social avatar:', error);
    return NextResponse.json(
      { avatarUrl: null }
    );
  }
}
