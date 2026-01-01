import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Track {
  id: string;
  title: string;
  frequency: string;
  duration: string;
  file_url: string;
  description?: string;
}

interface AudioPlayerContextType {
  tracks: Track[];
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  volume: number;
  analyser: AnalyserNode | null;
  isVisualizerOpen: boolean;
  isMinimized: boolean;
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  next: () => void;
  previous: () => void;
  skipTo: (index: number) => void;
  seek: (time: number) => void;
  setVolume: (level: number) => void;
  currentTrack: Track | undefined;
  openVisualizer: () => void;
  closeVisualizer: () => void;
  minimizePlayer: () => void;
  maximizePlayer: () => void;
  fetchTracks: () => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const tracksLengthRef = useRef(tracks.length);
  
  tracksLengthRef.current = tracks.length;

  const fetchTracks = useCallback(async () => {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const loadedTracks: Track[] = data.map(t => ({
        id: t.id,
        title: t.title,
        frequency: t.frequency || '',
        duration: t.duration || '0:00',
        file_url: t.file_url,
        description: t.description || undefined,
      }));
      
      setTracks(loadedTracks);
    }
  }, []);

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
        if (tracksLengthRef.current > 0) {
          setCurrentTrackIndex(prev => (prev + 1) % tracksLengthRef.current);
        }
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
  }, []);

  const loadTrack = useCallback((index: number) => {
    if (!audioRef.current || !tracks[index]) return;
    
    const track = tracks[index];
    if (!track.file_url) return;
    
    audioRef.current.src = track.file_url;
    audioRef.current.load();
    setCurrentTime(0);
  }, [tracks]);

  const play = useCallback(async () => {
    if (tracks.length === 0) return;
    
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
        setIsMinimized(true); // Auto-minimize when playing starts
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
    if (tracks.length === 0) return;
    skipTo((currentTrackIndex + 1) % tracks.length);
  }, [currentTrackIndex, tracks.length, skipTo]);

  const previous = useCallback(() => {
    if (tracks.length === 0) return;
    skipTo(currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1);
  }, [currentTrackIndex, tracks.length, skipTo]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((level: number) => {
    setVolumeState(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  const openVisualizer = useCallback(() => {
    setIsVisualizerOpen(true);
    setIsMinimized(false);
  }, []);

  const closeVisualizer = useCallback(() => {
    setIsVisualizerOpen(false);
    if (isPlaying) {
      setIsMinimized(true);
    }
  }, [isPlaying]);

  const minimizePlayer = useCallback(() => {
    setIsVisualizerOpen(false);
    setIsMinimized(true);
  }, []);

  const maximizePlayer = useCallback(() => {
    setIsVisualizerOpen(true);
    setIsMinimized(false);
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      initAudio();
      loadTrack(currentTrackIndex);
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [tracks, currentTrackIndex, initAudio, loadTrack, isPlaying]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        tracks,
        isPlaying,
        currentTrackIndex,
        currentTime,
        duration,
        volume,
        analyser: analyserRef.current,
        isVisualizerOpen,
        isMinimized,
        togglePlay,
        play,
        pause,
        next,
        previous,
        skipTo,
        seek,
        setVolume,
        currentTrack: tracks[currentTrackIndex],
        openVisualizer,
        closeVisualizer,
        minimizePlayer,
        maximizePlayer,
        fetchTracks,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
