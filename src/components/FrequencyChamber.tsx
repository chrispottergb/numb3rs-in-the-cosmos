import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Maximize2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FullscreenVisualizer from "./FullscreenVisualizer";
import AudioUploader from "./AudioUploader";
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

const FrequencyChamber = () => {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  return (
    <>
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

          {/* 3 Hero Images Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12"
          >
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
                      <Play className="h-12 w-12 text-primary mb-4" />
                      <span className="text-primary font-display text-xl">Enter Chamber</span>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
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
          </motion.div>
        </div>
      </section>

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

export default FrequencyChamber;
