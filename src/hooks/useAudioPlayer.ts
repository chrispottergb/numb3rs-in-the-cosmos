import { useState, useRef, useCallback, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  frequency: string;
  duration: string;
  file_url: string;
  description?: string;
}

export const useAudioPlayer = (tracks: Track[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        // Auto-play next track
        setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
      });
    }
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      
      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }
  }, [tracks.length]);

  const loadTrack = useCallback((index: number) => {
    if (!audioRef.current || !tracks[index]) return;
    
    const track = tracks[index];
    if (!track.file_url) {
      console.warn('Track has no file_url:', track.title);
      return;
    }
    
    console.log('Loading track:', track.title, track.file_url);
    audioRef.current.src = track.file_url;
    audioRef.current.load();
    setCurrentTime(0);
  }, [tracks]);

  const play = useCallback(async () => {
    if (tracks.length === 0) {
      console.warn('No tracks available to play');
      return;
    }
    
    initAudio();
    
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    if (audioRef.current) {
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        loadTrack(currentTrackIndex);
      }
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Playback started');
      } catch (error) {
        console.error('Playback failed:', error);
      }
    }
  }, [initAudio, tracks, currentTrackIndex, loadTrack]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const skipTo = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    loadTrack(index);
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [loadTrack, isPlaying]);

  const next = useCallback(() => {
    skipTo((currentTrackIndex + 1) % tracks.length);
  }, [currentTrackIndex, tracks.length, skipTo]);

  const previous = useCallback(() => {
    skipTo(currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1);
  }, [currentTrackIndex, tracks.length, skipTo]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    setVolume(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  // Load initial track
  useEffect(() => {
    if (tracks.length > 0) {
      initAudio();
      loadTrack(currentTrackIndex);
    }
  }, [tracks, currentTrackIndex, initAudio, loadTrack]);

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioContextRef.current?.close();
    };
  }, []);

  return {
    isPlaying,
    currentTrackIndex,
    currentTime,
    duration,
    volume,
    analyser: analyserRef.current,
    togglePlay,
    play,
    pause,
    next,
    previous,
    skipTo,
    seek,
    setVolume: setVolumeLevel,
    currentTrack: tracks[currentTrackIndex],
  };
};
