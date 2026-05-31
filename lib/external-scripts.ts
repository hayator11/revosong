/**
 * 外部スクリプト読み込みの管理
 * 重複読み込みを防ぎ、遅延読み込みをサポート
 */

let youtubeAPIPromise: Promise<void> | null = null;
let soundCloudAPIPromise: Promise<void> | null = null;

/**
 * YouTube IFrame API を読み込む
 * Promise を使用して読み込み完了を待つ
 */
export function loadYouTubeAPI(): Promise<void> {
  if (youtubeAPIPromise) {
    return youtubeAPIPromise;
  }

  youtubeAPIPromise = new Promise((resolve) => {
    // 既に読み込まれている場合はスキップ
    if ((window as any).YT && (window as any).YT.IFrame) {
      resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready');
      resolve();
    };

    document.body.appendChild(tag);

  });

  return youtubeAPIPromise;
}

/**
 * SoundCloud Widget API を読み込む
 * Promise を使用して読み込み完了を待つ
 */
export function loadSoundCloudAPI(): Promise<void> {
  if (soundCloudAPIPromise) {
    return soundCloudAPIPromise;
  }

  soundCloudAPIPromise = new Promise((resolve) => {
    // 既に読み込まれている場合はスキップ
    if ((window as any).SC && (window as any).SC.Widget) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => {
      console.log('SoundCloud API loaded');
      resolve();
    };
    script.onerror = () => {
      console.warn('Failed to load SoundCloud API');
      resolve(); // エラーでも続行
    };

    document.body.appendChild(script);

  });

  return soundCloudAPIPromise;
}

/**
 * 両方の API を読み込む
 */
export async function loadExternalAPIs(): Promise<void> {
  await Promise.all([loadYouTubeAPI(), loadSoundCloudAPI()]);
}
