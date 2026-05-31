const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA==';

export const CONTINUOUS_PLAYBACK_STORAGE_KEY = 'revosong:continuousPlaybackAllowed';

export async function unlockAutoplayForIOS(): Promise<boolean> {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (AudioContextClass) {
      const audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    }

    const audio = document.createElement('audio');
    audio.muted = true;
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';
    audio.src = SILENT_WAV;

    await audio.play();
    audio.pause();
    audio.remove();

    return true;
  } catch (error) {
    console.warn('Autoplay unlock failed:', error);
    return false;
  }
}
