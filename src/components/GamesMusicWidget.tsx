import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { useState } from 'react';

const GamesMusicWidget = () => {
  const {
    isPlaying,
    currentTrack,
    tracks,
    currentTime,
    duration,
    togglePlay,
    next,
    previous,
    skipTo,
    openVisualizer,
  } = useAudioPlayerContext();

  const [isExpanded, setIsExpanded] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (tracks.length === 0) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="relative bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-sacred overflow-hidden">
        {/* Progress bar on side */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20"
        >
          <motion.div 
            className="absolute bottom-0 left-0 w-full bg-primary"
            style={{ height: `${progress}%` }}
          />
        </div>
        
        {/* Main content */}
        <div className="pl-3 pr-3 py-3">
          {/* Collapsed view - just play button */}
          <div className="flex flex-col items-center gap-2">
            {/* Music icon / expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              <Music className="w-5 h-5 text-primary" />
            </button>

            {/* Play/Pause - always visible */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-primary/20 hover:bg-primary/30"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            {/* Expanded controls */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col items-center gap-2 overflow-hidden"
                >
                  {/* Skip controls */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={previous}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={next}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {/* Track info */}
                  {currentTrack && (
                    <button 
                      onClick={openVisualizer}
                      className="text-center hover:opacity-80 transition-opacity py-2"
                    >
                      <p className="text-[10px] font-medium text-foreground max-w-[80px] truncate">
                        {currentTrack.title}
                      </p>
                      <p className="text-[9px] text-primary">
                        {currentTrack.frequency}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {formatTime(currentTime)}
                      </p>
                    </button>
                  )}

                  {/* Track list */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
                    {tracks.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => skipTo(index)}
                        className={`text-[9px] px-2 py-1 rounded transition-colors text-left ${
                          currentTrack?.id === track.id 
                            ? 'bg-primary/20 text-primary' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {track.title.substring(0, 12)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand/collapse indicator */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamesMusicWidget;
