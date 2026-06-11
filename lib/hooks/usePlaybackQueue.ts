'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CONTINUOUS_PLAYBACK_STORAGE_KEY,
  unlockAutoplayForIOS
} from '@/lib/autoplay-unlock';
import { isContinuousPlayableProvider } from '@/lib/track-url-utils';

export type PlaybackTrack = {
  id: string;
  provider: string;
  originalUrl: string;
  embedUrl?: string;
  title: string;
  providerTrackId?: string;
};

type UsePlaybackQueueArgs = {
  tracks: PlaybackTrack[];
  mode: 'playlist' | 'ranking';
};

export function usePlaybackQueue({ tracks, mode }: UsePlaybackQueueArgs) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isContinuousAllowed, setAllowedState] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  useEffect(() => {
    setAllowedState(localStorage.getItem(CONTINUOUS_PLAYBACK_STORAGE_KEY) === 'true');
  }, []);

  const continuousPlayableTracks = useMemo(
    () => mode === 'ranking'
      ? tracks.filter((track) => isContinuousPlayableProvider(track.provider))
      : tracks,
    [mode, tracks]
  );

  const currentTrack =
    currentIndex === null ? null : continuousPlayableTracks[currentIndex] ?? null;

  const setIsContinuousAllowed = useCallback(async (allowed: boolean) => {
    if (!allowed) {
      localStorage.setItem(CONTINUOUS_PLAYBACK_STORAGE_KEY, 'false');
      setAllowedState(false);
      setNeedsUserGesture(false);
      return false;
    }

    const unlocked = await unlockAutoplayForIOS();
    localStorage.setItem(CONTINUOUS_PLAYBACK_STORAGE_KEY, unlocked ? 'true' : 'false');
    setAllowedState(unlocked);
    setNeedsUserGesture(!unlocked);

    if (unlocked && currentIndex === null && continuousPlayableTracks.length > 0) {
      setCurrentIndex(0);
      setReplaySignal((value) => value + 1);
    }

    return unlocked;
  }, [continuousPlayableTracks.length, currentIndex]);

  const goNext = useCallback(() => {
    setNeedsUserGesture(false);
    setCurrentIndex((index) => {
      if (index === null) return continuousPlayableTracks.length > 0 ? 0 : null;
      const nextIndex = index + 1;
      return nextIndex < continuousPlayableTracks.length ? nextIndex : null;
    });
    setReplaySignal((value) => value + 1);
  }, [continuousPlayableTracks.length]);

  const goPrev = useCallback(() => {
    setNeedsUserGesture(false);
    setCurrentIndex((index) => {
      if (index === null) return null;
      return index > 0 ? index - 1 : index;
    });
    setReplaySignal((value) => value + 1);
  }, []);

  const handleEnded = useCallback(() => {
    if (!isContinuousAllowed) return;
    goNext();
  }, [goNext, isContinuousAllowed]);

  return {
    currentTrack,
    currentIndex,
    setCurrentIndex,
    isContinuousAllowed,
    setIsContinuousAllowed,
    goNext,
    goPrev,
    handleEnded,
    replaySignal,
    needsUserGesture,
    setNeedsUserGesture,
    continuousPlayableTracks
  };
}
