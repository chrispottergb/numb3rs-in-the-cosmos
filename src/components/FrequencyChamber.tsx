import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const tracks = [
  { id: 1, title: "Infinity Sign", frequency: "432 Hz", duration: "4:32" },
  { id: 2, title: "Cosmic Resonance", frequency: "528 Hz", duration: "5:18" },
  { id: 3, title: "Divine Mathematics", frequency: "639 Hz", duration: "6:07" },
  { id: 4, title: "Sacred Spiral", frequency: "741 Hz", duration: "4:55" },
  { id: 5, title: "Void Walker", frequency: "852 Hz", duration: "7:23" },
];

const FrequencyChamber = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([70]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
            Experience the healing vibrations. Watch the cymatics visualizer respond 
            to sacred frequencies in real-time.
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
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Concentric circles for cymatics effect */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-primary/30 rounded-full"
                      style={{
                        width: `${(i + 1) * 80}px`,
                        height: `${(i + 1) * 80}px`,
                        left: `${-(i + 1) * 40}px`,
                        top: `${-(i + 1) * 40}px`,
                      }}
                      animate={isPlaying ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      } : {}}
                      transition={{
                        duration: 1.5 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary/50 animate-pulse" />
                </motion.div>
              </div>

              {/* Current frequency display */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg">
                <span className="text-sm text-muted-foreground">Current Frequency</span>
                <p className="text-xl font-display text-primary text-glow-cyan">
                  {tracks[currentTrack].frequency}
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
                    onClick={() => setCurrentTrack(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      currentTrack === index
                        ? "bg-primary/10 border-hermetic"
                        : "hover:bg-muted/50"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${
                        currentTrack === index ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-medium ${
                        currentTrack === index ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {track.title}
                      </span>
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
