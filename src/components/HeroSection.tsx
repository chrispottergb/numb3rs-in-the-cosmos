import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Play, Maximize2, Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FullscreenVisualizer from "./FullscreenVisualizer";
import AudioUploader from "./AudioUploader";
import cosmicSeal from "@/assets/cosmic-seal-hero.png";
import flowerOfLife from "@/assets/flower-of-life.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import torusField from "@/assets/torus-field.png";

const tracks = [
  { 
    id: 1, 
    title: "The Spell Breaker", 
    frequency: "528Hz", 
    description: "Hexagonal structure of 528Hz",
    image: flowerOfLife,
  },
  { 
    id: 2, 
    title: "Numb3rs in the Cosmos", 
    frequency: "432Hz", 
    description: "Golden Spiral",
    image: metatronsCube,
  },
  { 
    id: 3, 
    title: "Infinity Sign", 
    frequency: "639Hz", 
    description: "Torus field",
    image: torusField,
  },
];

const HeroSection = () => {
  const [showChamber, setShowChamber] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  return (
    <>
      <section id="portal" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        {/* Cosmic particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 text-center">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display mb-4"
          >
            <span className="text-gradient-sacred text-2xl md:text-3xl lg:text-4xl">DR. POTTER, DMA</span>
          </motion.h1>


          {/* The Declaration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            <p className="italic mb-4">
              You already know what governs this space—Correspondence and Vibration. What you may not yet realize is how deeply you understand what I survived: the clinical system, the medications, the electroshock. And as you begin to remember, you'll notice <span className="text-accent font-semibold">Numb3rs in the Cosmos</span> offers exactly what you've been searching for—three frequencies (<span className="text-primary">528Hz</span>, <span className="text-primary">432Hz</span>, <span className="text-primary">639Hz</span>) that allow you to reclaim what was always yours.
            </p>
            <p className="italic">
              Imagine, weeks from now, looking back at this moment—the moment you decided to listen. You'll remember how naturally the frequencies integrated, how effortlessly your sovereignty returned. And you'll wonder why it took so long to find what was waiting here all along. That future self is already grateful you stayed.
            </p>
          </motion.div>

          {/* Square Nav Button to Frequency Chamber */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-12"
          >
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-primary/30 blur-xl"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.button
              onClick={() => setShowChamber(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full h-full rounded-xl border-hermetic bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 overflow-hidden shadow-sacred cursor-pointer z-10"
            >
              <img
                src={cosmicSeal}
                alt="Enter Frequency Chamber"
                className="w-full h-full object-cover"
              />
            </motion.button>
          </motion.div>


          {/* Hermetic Seal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="border-hermetic rounded-xl p-6 md:p-8 bg-card/50 backdrop-blur-sm max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-accent" />
              <h3 className="text-lg md:text-xl font-display font-semibold text-accent tracking-wider uppercase">
                Hermetic Seal
              </h3>
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              This space is protected by the <span className="text-primary font-medium">Law of Mentalism</span>. All energy here is encoded with a <span className="text-accent font-medium">3-6-9 barrier</span>. Dark siphoning, parasitic frequency, and energy leaks are neutralized upon entry.
            </p>
            <p className="text-primary mt-4 font-display tracking-widest text-sm">
              As above, so below.
            </p>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Frequency Chamber Dialog */}
      <Dialog open={showChamber} onOpenChange={setShowChamber}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-hermetic p-6 md:p-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-display text-gradient-sacred mb-4">
              The Frequency Chamber
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cymatic Visualizer — Where Sound Becomes Sacred Geometry
            </p>
          </div>

          {/* 3 Hero Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredTrack(index)}
                onMouseLeave={() => setHoveredTrack(null)}
                onClick={() => setShowVisualizer(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden border-hermetic bg-card/50 backdrop-blur-sm">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-background/60 transition-opacity duration-300 ${
                    hoveredTrack === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Play className="h-10 w-10 text-primary mb-3" />
                      <span className="text-primary font-display text-lg">Enter Chamber</span>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Track info */}
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-display text-foreground mb-1">
                    {track.title}
                  </h3>
                  <p className="text-primary text-glow-cyan">
                    {track.frequency}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {track.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="sacred"
              size="xl"
              onClick={() => setShowVisualizer(true)}
            >
              <Maximize2 className="h-5 w-5 mr-2" />
              Open Fullscreen Visualizer
            </Button>
            <Button
              variant="hermetic"
              size="xl"
              onClick={() => setShowUploader(true)}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Your Music
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FullscreenVisualizer
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />

      {showUploader && (
        <AudioUploader
          onUploadComplete={() => setShowUploader(false)}
          onClose={() => setShowUploader(false)}
        />
      )}
    </>
  );
};

export default HeroSection;
