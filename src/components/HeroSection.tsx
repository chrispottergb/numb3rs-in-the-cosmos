import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Maximize2, Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FullscreenVisualizer from "./FullscreenVisualizer";
import AudioUploader from "./AudioUploader";
import cosmicSeal from "@/assets/cosmic-seal-hero.png";
import flowerOfLife from "@/assets/flower-of-life.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import torusField from "@/assets/torus-field.png";
import numb3rsBanner from "@/assets/numb3rs-cosmos-banner.jpeg";

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

          {/* Numb3rs in the Cosmos Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-2 max-w-2xl mx-auto"
          >
            <img
              src={numb3rsBanner}
              alt="Numb3rs in the Cosmos - Frequency Medicine · Sacred Geometry · Divine Mathematics"
              className="w-full h-auto rounded-xl"
            />
          </motion.div>

          {/* Square Nav Button to Frequency Chamber */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto mb-8"
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

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-display mb-4"
          >
            <span className="text-gradient-sacred text-2xl md:text-3xl lg:text-4xl">DR. POTTER, DMA</span>
          </motion.h1>

          {/* Album Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-xl md:text-2xl lg:text-3xl font-display text-gradient-sacred tracking-wider"
          >
            NUMB3RS IN THE COSMOS
          </motion.h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
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
