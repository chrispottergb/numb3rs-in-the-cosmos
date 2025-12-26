import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

const MiniPlayer = () => {
  const {
    isPlaying,
    isMinimized,
    currentTrack,
    currentTime,
    duration,
    togglePlay,
    next,
    previous,
    maximizePlayer,
    pause,
  } = useAudioPlayerContext();

  // Only show when minimized and has a track
  if (!isMinimized || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    pause();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative bg-card/95 backdrop-blur-xl border border-primary/30 rounded-full px-4 py-2 shadow-sacred flex items-center gap-3">
          {/* Progress bar background */}
          <div 
            className="absolute inset-0 rounded-full bg-primary/10 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
          />
          
          {/* Content */}
          <div className="relative flex items-center gap-3">
            {/* Track info */}
            <button 
              onClick={maximizePlayer}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              </div>
              <div className="text-left max-w-[120px] md:max-w-[180px]">
                <p className="text-xs font-medium text-foreground truncate">
                  {currentTrack.title}
                </p>
                <p className="text-[10px] text-primary">
                  {currentTrack.frequency} • {formatTime(currentTime)}
                </p>
              </div>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={previous}
              >
                <SkipBack className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={next}
              >
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>

            {/* Expand button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={maximizePlayer}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/20"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
