import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Minimize2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import SacredGeometryVisualizer from './SacredGeometryVisualizer';
import WaveformProgress from './WaveformProgress';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import flowerOfLife from '@/assets/flower-of-life.png';
import metatronsCube from '@/assets/metatrons-cube.png';
import torusField from '@/assets/torus-field.png';

const defaultSlots = [
  { title: "The Spell Breaker", frequency: "528Hz" },
  { title: "Numb3rs in the Cosmos", frequency: "432Hz" },
  { title: "Infinity Sign", frequency: "639Hz" },
];

const trackImages = [flowerOfLife, metatronsCube, torusField];

const FullscreenVisualizer = () => {
  const {
    tracks,
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
    isVisualizerOpen,
    closeVisualizer,
    minimizePlayer,
  } = useAudioPlayerContext();

  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const hasPlayableTracks = tracks.length > 0;

  if (!isVisualizerOpen) return null;

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
          <Button variant="ghost" size="icon" onClick={minimizePlayer} title="Minimize (keep playing)">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={closeVisualizer}>
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

        {/* Hero Images Display */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8 z-10">
          {trackImages.map((img, index) => {
            const isCurrentlyPlaying = currentTrackIndex === index;
            
            return (
              <motion.div key={index} className="flex flex-col items-center gap-2">
                <motion.button
                  onClick={() => skipTo(index)}
                  className={`relative rounded-lg overflow-hidden transition-all ${
                    isCurrentlyPlaying ? 'ring-2 ring-primary scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={img}
                    alt={tracks[index]?.title || defaultSlots[index].title}
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
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-12 pb-4 px-4"
        >
          <div className="max-w-2xl mx-auto">
            {/* Track title */}
            <div className="text-center mb-3">
              <h2 className="text-xl md:text-2xl font-display text-gradient-sacred mb-1">
                {currentTrack?.title || defaultSlots[0].title}
              </h2>
              <p className="text-primary text-glow-cyan text-sm">
                {currentTrack?.frequency || defaultSlots[0].frequency}
              </p>
            </div>

            {/* Waveform Progress */}
            <div className="mb-3">
              <WaveformProgress
                analyser={analyser}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                isPlaying={isPlaying}
              />
            </div>

            {/* Compact Controls Row */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(value / 100)}
                  className="w-20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={previous}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="sacred"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={togglePlay}
                  disabled={!hasPlayableTracks}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!hasPlayableTracks && (
              <p className="text-center text-muted-foreground mt-2 text-xs">
                No tracks available
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenVisualizer;
