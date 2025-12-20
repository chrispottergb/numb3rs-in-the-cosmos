import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Hexagon, Flower, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const tracks = [
  { 
    id: 1, 
    title: "The Spell Breaker", 
    frequency: "528Hz", 
    duration: "4:32",
    visualization: "Hexagonal structure of 528Hz",
    icon: Hexagon,
  },
  { 
    id: 2, 
    title: "Numb3rs in the Cosmos", 
    frequency: "432Hz", 
    duration: "5:18",
    visualization: "Golden Spiral",
    icon: Flower,
  },
  { 
    id: 3, 
    title: "Infinity Sign", 
    frequency: "639Hz", 
    duration: "6:07",
    visualization: "Torus field",
    icon: Circle,
  },
];

const FrequencyChamber = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([70]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CurrentIcon = tracks[currentTrack].icon;

  return (
    <section className="relative py-24 overflow-hidden" id="frequency-chamber">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display text-gradient-sacred mb-4">
            The Frequency Chamber
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cymatic Visualizer — Where Sound Becomes Sacred Geometry
          </p>
        </motion.div>

        {/* Player Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="border-hermetic rounded-2xl bg-card/50 backdrop-blur-sm p-8 shadow-sacred">
            {/* Cymatics Visualizer */}
            <div className="relative aspect-video mb-8 rounded-xl overflow-hidden bg-background/50">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
              />
              {/* Visualizer placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={isPlaying ? { scale: [1, 1.2, 1], rotate: 360 } : {}}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                >
                  {/* Dynamic icon based on current track */}
                  <CurrentIcon 
                    className="w-32 h-32 text-primary opacity-80" 
                    strokeWidth={0.5} 
                  />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
                  
                  {/* Concentric circles for cymatics effect */}
                  {isPlaying && [...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-primary/30 rounded-full"
                      style={{
                        width: `${(i + 1) * 80}px`,
                        height: `${(i + 1) * 80}px`,
                        left: `${-(i + 1) * 40 + 64}px`,
                        top: `${-(i + 1) * 40 + 64}px`,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 1.5 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Current frequency display */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg">
                <span className="text-sm text-muted-foreground">Current Frequency</span>
                <p className="text-xl font-display text-primary text-glow-cyan">
                  {tracks[currentTrack].frequency}
                </p>
              </div>

              {/* Visualization info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg text-center">
                <span className="text-xs text-muted-foreground">Visualizing</span>
                <p className="text-sm text-primary font-medium">
                  {tracks[currentTrack].visualization}
                </p>
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-display text-foreground mb-1">
                {tracks[currentTrack].title}
              </h3>
              <p className="text-muted-foreground">
                {tracks[currentTrack].frequency} · {tracks[currentTrack].duration}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0:00</span>
                <span>{tracks[currentTrack].duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentTrack(prev => prev > 0 ? prev - 1 : tracks.length - 1)}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button
                variant="sacred"
                size="icon"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentTrack(prev => prev < tracks.length - 1 ? prev + 1 : 0)}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
              />
            </div>

            {/* Track List */}
            <div className="mt-8 border-t border-border/30 pt-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Playlist
              </h4>
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <motion.button
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(index);
                      setIsPlaying(true);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      currentTrack === index
                        ? "bg-primary/10 border-hermetic"
                        : "hover:bg-muted/50"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentTrack === index ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <track.icon className={`h-5 w-5 ${currentTrack === index ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="text-left">
                        <span className={`font-medium block ${
                          currentTrack === index ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {track.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {track.visualization}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-primary/70">{track.frequency}</span>
                      <span>{track.duration}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FrequencyChamber;
