import { useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  frequency: string;
  duration: string;
  file_url: string;
  description?: string;
}

interface MediaSessionConfig {
  currentTrack: Track | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
}

// Map track index to artwork - cycles through available sacred geometry images
const artworkImages = [
  '/src/assets/flower-of-life.png',
  '/src/assets/metatrons-cube.png',
  '/src/assets/sri-yantra.png',
  '/src/assets/torus-field.png',
  '/src/assets/vesica-piscis.png',
  '/src/assets/seed-of-life.png',
];

export const useMediaSession = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
}: MediaSessionConfig) => {
  // Set up Media Session API for lock screen controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }

    if (!currentTrack) {
      return;
    }

    // Get artwork based on track - use a hash of the track id to pick an image
    const artworkIndex = currentTrack.id.charCodeAt(0) % artworkImages.length;
    const artworkSrc = artworkImages[artworkIndex];

    // Set metadata for lock screen display
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: 'Numb3rs in the Cosmos',
      album: currentTrack.frequency || 'Sacred Frequencies',
      artwork: [
        { src: artworkSrc, sizes: '96x96', type: 'image/png' },
        { src: artworkSrc, sizes: '128x128', type: 'image/png' },
        { src: artworkSrc, sizes: '192x192', type: 'image/png' },
        { src: artworkSrc, sizes: '256x256', type: 'image/png' },
        { src: artworkSrc, sizes: '384x384', type: 'image/png' },
        { src: artworkSrc, sizes: '512x512', type: 'image/png' },
      ],
    });
  }, [currentTrack]);

  // Set up action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }

    // Play action
    navigator.mediaSession.setActionHandler('play', () => {
      onPlay();
    });

    // Pause action
    navigator.mediaSession.setActionHandler('pause', () => {
      onPause();
    });

    // Next track action
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      onNext();
    });

    // Previous track action
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      onPrevious();
    });

    // Seek to specific position
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        onSeek(details.seekTime);
      }
    });

    // Seek backward (typically 10 seconds)
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 10;
      onSeek(Math.max(currentTime - skipTime, 0));
    });

    // Seek forward (typically 10 seconds)
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      onSeek(Math.min(currentTime + skipTime, duration));
    });

    // Stop action
    navigator.mediaSession.setActionHandler('stop', () => {
      onPause();
    });

    return () => {
      // Clean up handlers
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('stop', null);
      } catch (e) {
        // Some handlers may not be supported
      }
    };
  }, [onPlay, onPause, onNext, onPrevious, onSeek, currentTime, duration]);

  // Update playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  // Update position state for seek bar on lock screen
  useEffect(() => {
    if (!('mediaSession' in navigator) || !duration) {
      return;
    }

    try {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: Math.min(currentTime, duration),
      });
    } catch (e) {
      // Position state may not be supported
    }
  }, [currentTime, duration]);
};
