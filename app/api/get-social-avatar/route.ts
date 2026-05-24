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
        // https://x.com/username or https://twitter.com/username
        const xMatch = pathname.match(/^\/([a-zA-Z0-9_]+)/?$/);
        return xMatch ? xMatch[1] : null;

      case 'instagram':
        // https://instagram.com/username or https://www.instagram.com/username
        const igMatch = pathname.match(/^\/([a-zA-Z0-9_.]+)/?$/);
        return igMatch ? igMatch[1] : null;

      case 'youtube':
        // https://youtube.com/@username or https://www.youtube.com/@username
        const ytMatch = pathname.match(/^\/(@[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_-]+)/?$/);
        return ytMatch ? ytMatch[1] : null;

      case 'tiktok':
        // https://tiktok.com/@username
        const ttMatch = pathname.match(/^\/(@[a-zA-Z0-9_.]+)/?$/);
        return ttMatch ? ttMatch[1] : null;

      case 'facebook':
        // https://facebook.com/username
        const fbMatch = pathname.match(/^\/([a-zA-Z0-9.]+)/?$/);
        return fbMatch ? fbMatch[1] : null;

      case 'discord':
        // Discord doesn't have standard profile URLs, return null
        return null;

      case 'threads':
        // https://threads.net/@username
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
 * Get profile avatar from SNS platform
 */
async function getSocialAvatar(url: string, platform: string): Promise<string | null> {
  try {
    const username = extractSNSUsername(url, platform);
    if (!username) return null;

    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter': {
        // Use unavatar.io for Twitter
        const cleanUsername = username.replace('@', '');
        return `https://unavatar.io/twitter/${cleanUsername}`;
      }

      case 'instagram': {
        // Use unavatar.io for Instagram
        const cleanUsername = username.replace('@', '');
        return `https://unavatar.io/instagram/${cleanUsername}`;
      }

      case 'youtube': {
        // YouTube is more complex, use unavatar if possible
        const cleanUsername = username.replace('@', '');
        return `https://unavatar.io/youtube/${cleanUsername}`;
      }

      case 'tiktok': {
        // Use unavatar.io for TikTok
        const cleanUsername = username.replace('@', '');
        return `https://unavatar.io/tiktok/${cleanUsername}`;
      }

      case 'facebook': {
        // Facebook profile picture URL
        return `https://graph.facebook.com/${username}/picture?type=large`;
      }

      case 'threads': {
        // Threads profile via unavatar
        const cleanUsername = username.replace('@', '');
        return `https://unavatar.io/threads/${cleanUsername}`;
      }

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
        { error: 'Missing url or platform parameter' },
        { status: 400 }
      );
    }

    const avatarUrl = await getSocialAvatar(url, platform);

    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Could not extract avatar URL' },
        { status: 404 }
      );
    }

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error('Error getting social avatar:', error);
    return NextResponse.json(
      { error: 'Failed to get social avatar' },
      { status: 500 }
    );
  }
}
