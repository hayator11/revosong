/**
 * YouTubeのビデオIDを抽出
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * YouTubeのサムネイル画像URLを取得
 * @param videoId YouTubeビデオID
 * @param quality 画質: 'maxres' | 'sd' | 'hq' | 'mq' (デフォルト: 'mq')
 */
export function getYouTubeThumbnail(videoId: string, quality: 'maxres' | 'sd' | 'hq' | 'mq' = 'mq'): string {
  const qualityMap = {
    'maxres': 'maxresdefault',
    'sd': 'sddefault',
    'hq': 'hqdefault',
    'mq': 'mqdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * SoundCloudのURLかどうかを判定
 */
export function isSoundCloudUrl(url: string): boolean {
  if (!url) return false;
  return /soundcloud\.com/.test(url);
}

/**
 * SoundCloudのoEmbed情報を取得（サムネイル、タイトルなど）
 */
export async function getSoundCloudEmbed(trackUrl: string): Promise<{
  thumbnail_url: string;
  title: string;
  duration?: number;
} | null> {
  try {
    const response = await fetch(
      `https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`,
      { mode: 'cors' }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      thumbnail_url: data.thumbnail_url || '',
      title: data.title || '',
      duration: data.duration || undefined
    };
  } catch (error) {
    console.error('SoundCloud oEmbed error:', error);
    return null;
  }
}

/**
 * メディアサービスを判定
 */
export function getMediaService(url: string): 'youtube' | 'soundcloud' | 'spotify' | 'niconico' | 'other' {
  if (!url) return 'other';

  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/soundcloud\.com/.test(url)) return 'soundcloud';
  if (/spotify\.com/.test(url)) return 'spotify';
  if (/nicovideo\.jp|nico\.ms/.test(url)) return 'niconico';

  return 'other';
}

/**
 * メディアタイプに応じたアイコン・ロゴを取得
 */
export function getMediaIcon(service: string): string {
  const icons: Record<string, string> = {
    'youtube': '🎬',
    'soundcloud': '🔊',
    'spotify': '🎵',
    'niconico': 'ニ',
    'other': '🎵'
  };
  return icons[service] || '🎵';
}

/**
 * メディアサービス名を取得（日本語）
 */
export function getMediaServiceName(service: string): string {
  const names: Record<string, string> = {
    'youtube': 'YouTube',
    'soundcloud': 'SoundCloud',
    'spotify': 'Spotify',
    'niconico': 'ニコニコ',
    'other': '外部リンク'
  };
  return names[service] || 'その他';
}

/**
 * サムネイル画像を取得（URLから）
 */
export async function getThumbnail(mediaUrl: string): Promise<string | null> {
  const service = getMediaService(mediaUrl);

  if (service === 'youtube') {
    const videoId = getYouTubeId(mediaUrl);
    if (videoId) {
      return getYouTubeThumbnail(videoId, 'mq');
    }
  } else if (service === 'soundcloud') {
    const embedData = await getSoundCloudEmbed(mediaUrl);
    if (embedData?.thumbnail_url) {
      return embedData.thumbnail_url;
    }
  }

  return null;
}

/**
 * SNS プラットフォーム情報
 */
export const SNS_PLATFORMS = {
  'twitter': { icon: '🐦', name: 'X (Twitter)', color: '#1DA1F2' },
  'x': { icon: '𝕏', name: 'X', color: '#000000' },
  'instagram': { icon: '📷', name: 'Instagram', color: '#E4405F' },
  'youtube': { icon: '▶️', name: 'YouTube', color: '#FF0000' },
  'soundcloud': { icon: '🔊', name: 'SoundCloud', color: '#FF7700' },
  'facebook': { icon: 'f', name: 'Facebook', color: '#1877F2' },
  'tiktok': { icon: '♪', name: 'TikTok', color: '#000000' },
  'discord': { icon: '💜', name: 'Discord', color: '#5865F2' },
  'website': { icon: '🌐', name: 'ウェブサイト', color: '#0066cc' }
} as const;

/**
 * SNSアイコン情報を取得
 */
export function getSNSInfo(platform: string): { icon: string; name: string; color: string } | null {
  const key = platform.toLowerCase() as keyof typeof SNS_PLATFORMS;
  return SNS_PLATFORMS[key] || null;
}
