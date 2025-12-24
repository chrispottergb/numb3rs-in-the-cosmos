import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Minimize2, Upload, Music, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import SacredGeometryVisualizer from './SacredGeometryVisualizer';
import TrackSlotUploader from './TrackSlotUploader';
import TrackEditor from './TrackEditor';
import WaveformProgress from './WaveformProgress';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { supabase } from '@/integrations/supabase/client';
import flowerOfLife from '@/assets/flower-of-life.png';
import metatronsCube from '@/assets/metatrons-cube.png';
import torusField from '@/assets/torus-field.png';

interface Track {
  id: string;
  title: string;
  frequency: string;
  duration: string;
  file_url: string;
  description?: string;
}

// Default track slot definitions
const defaultSlots = [
  { 
    title: "The Spell Breaker", 
    frequency: "528Hz", 
    description: "Track slot 0",
  },
  { 
    title: "Numb3rs in the Cosmos", 
    frequency: "432Hz", 
    description: "Track slot 1",
  },
  { 
    title: "Infinity Sign", 
    frequency: "639Hz", 
    description: "Track slot 2",
  },
];

const trackImages = [flowerOfLife, metatronsCube, torusField];

interface FullscreenVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenVisualizer = ({ isOpen, onClose }: FullscreenVisualizerProps) => {
  // Track slots: array of 3, each can be null or a Track
  const [trackSlots, setTrackSlots] = useState<(Track | null)[]>([null, null, null]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Only pass tracks with actual audio files to the player
  const playableTracks = useMemo(() => trackSlots.filter((t): t is Track => t !== null && !!t.file_url), [trackSlots]);

  const {
    isPlaying,
    currentTrackIndex,
    currentTime,
    duration,
    volume,
    analyser,
    togglePlay,
    next,
    previous,
    skipTo,
    seek,
    setVolume,
    currentTrack,
  } = useAudioPlayer(playableTracks);

  const fetchTracks = useCallback(async () => {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      // Map tracks to slots based on description (Track slot 0, Track slot 1, Track slot 2)
      const newSlots: (Track | null)[] = [null, null, null];
      
      data.forEach(t => {
        const track: Track = {
          id: t.id,
          title: t.title,
          frequency: t.frequency || '',
          duration: t.duration || '0:00',
          file_url: t.file_url,
          description: t.description || undefined,
        };
        
        // Parse slot index from description
        const match = t.description?.match(/Track slot (\d+)/);
        if (match) {
          const slotIndex = parseInt(match[1], 10);
          if (slotIndex >= 0 && slotIndex < 3) {
            newSlots[slotIndex] = track;
          }
        }
      });
      
      setTrackSlots(newSlots);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTracks();
    }
  }, [isOpen, fetchTracks]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const hasPlayableTracks = playableTracks.length > 0;

  // Get playable index for a slot
  const getPlayableIndex = (slotIndex: number): number => {
    let playableIdx = 0;
    for (let i = 0; i < slotIndex; i++) {
      if (trackSlots[i] !== null) playableIdx++;
    }
    return playableIdx;
  };

  const deleteTrack = async (track: Track) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', track.id);

      if (dbError) throw dbError;

      // Try to delete from storage (extract filename from URL)
      const urlParts = track.file_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (fileName) {
        await supabase.storage.from('audio-tracks').remove([fileName]);
      }

      toast.success('Track deleted successfully');
      fetchTracks();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete track');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Close and fullscreen buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Visualizer Canvas */}
        <div className="absolute inset-0">
          <SacredGeometryVisualizer
            analyser={analyser}
            isPlaying={isPlaying}
            currentTrack={currentTrackIndex}
          />
        </div>

        {/* Hero Images Display - 3 track slots */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8 z-10">
          {trackImages.map((img, index) => {
            const slotTrack = trackSlots[index];
            const hasAudio = slotTrack !== null;
            const playableIdx = hasAudio ? getPlayableIndex(index) : -1;
            const isCurrentlyPlaying = hasAudio && currentTrackIndex === playableIdx;
            
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <motion.button
                  onClick={() => {
                    if (hasAudio) {
                      skipTo(playableIdx);
                    }
                  }}
                  className={`relative rounded-lg overflow-hidden transition-all ${
                    isCurrentlyPlaying ? 'ring-2 ring-primary scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={img}
                    alt={slotTrack?.title || defaultSlots[index].title}
                    className="w-28 h-28 md:w-36 md:h-36 object-cover"
                  />
                  {isCurrentlyPlaying && isPlaying && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Music className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  )}
                </motion.button>
                
              </motion.div>
            );
          })}
        </div>

        {/* Track info overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-24 pb-8 px-4"
        >
          <div className="max-w-4xl mx-auto">
            {/* Track title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-4xl font-display text-gradient-sacred mb-2">
                {currentTrack?.title || defaultSlots[0].title}
              </h2>
              <p className="text-primary text-glow-cyan text-lg">
                {currentTrack?.frequency || defaultSlots[0].frequency}
              </p>
            </div>

            {/* Waveform Progress */}
            <div className="mb-6">
              <WaveformProgress
                analyser={analyser}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                isPlaying={isPlaying}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <Button variant="ghost" size="icon" onClick={previous}>
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button
                variant="sacred"
                size="icon"
                className="w-16 h-16 rounded-full"
                onClick={togglePlay}
                disabled={!hasPlayableTracks}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={next}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-4 flex-1 max-w-xs">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(value / 100)}
                />
              </div>
            </div>

            {!hasPlayableTracks && (
              <p className="text-center text-muted-foreground mt-4 text-sm">
                Click on a track slot above to upload audio
              </p>
            )}

          </div>
        </motion.div>

        {uploadingSlot !== null && (
          <TrackSlotUploader
            slotIndex={uploadingSlot}
            defaultTitle={defaultSlots[uploadingSlot].title}
            defaultFrequency={defaultSlots[uploadingSlot].frequency}
            existingTrack={trackSlots[uploadingSlot]}
            onUploadComplete={fetchTracks}
            onClose={() => setUploadingSlot(null)}
          />
        )}

        {showEditor && editingTrack && (
          <TrackEditor
            track={editingTrack}
            onSave={fetchTracks}
            onClose={() => {
              setShowEditor(false);
              setEditingTrack(null);
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenVisualizer;
