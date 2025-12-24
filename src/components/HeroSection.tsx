import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FullscreenVisualizer from "./FullscreenVisualizer";

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
  
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  return (
    <>
      <section id="portal" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
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

          {/* Square Nav Button to Frequency Chamber - Enlarged with Play Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto mb-6"
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
              {/* Translucent Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-primary ml-1" fill="currentColor" fillOpacity={0.3} />
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-display"
          >
            <span className="text-gradient-sacred text-2xl md:text-3xl lg:text-4xl">DR. POTTER, DMA</span>
          </motion.h1>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Frequency Chamber Dialog */}
      <Dialog open={showChamber} onOpenChange={setShowChamber}>
        <DialogContent className="max-w-sm w-[85vw] h-auto bg-background/95 backdrop-blur-xl border-hermetic p-4 overflow-hidden">

          {/* 3 Hero Images Grid */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-3 gap-2 w-full">
              {tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredTrack(index)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  onClick={() => { setShowVisualizer(true); setShowChamber(false); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden border-hermetic bg-card/50 backdrop-blur-sm">
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
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Track info */}
                  <div className="mt-1 text-center">
                    <h3 className="text-xs font-display text-foreground">
                      {track.title}
                    </h3>
                    <p className="text-primary text-glow-cyan text-[10px]">
                      {track.frequency}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              variant="sacred"
              size="default"
              onClick={() => { setShowVisualizer(true); setShowChamber(false); }}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen Visualizer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FullscreenVisualizer
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />

    </>
  );
};

export default HeroSection;
