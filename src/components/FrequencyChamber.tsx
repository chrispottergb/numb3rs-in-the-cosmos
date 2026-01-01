import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Maximize2, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import FullscreenVisualizer from "./FullscreenVisualizer";
import AudioUploader from "./AudioUploader";
import TrackAdmin from "./TrackAdmin";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Default images for tracks
import flowerOfLife from "@/assets/flower-of-life.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import torusField from "@/assets/torus-field.png";
import sriYantra from "@/assets/sri-yantra.png";
import vesicaPiscis from "@/assets/vesica-piscis.png";
import seedOfLife from "@/assets/seed-of-life.png";

const defaultImages = [
  flowerOfLife,
  metatronsCube,
  torusField,
  sriYantra,
  vesicaPiscis,
  seedOfLife,
];

const FrequencyChamber = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const { openVisualizer, tracks, skipTo, fetchTracks } = useAudioPlayerContext();
  const { user, isAdmin } = useAuth();

  const handleUploadClick = () => {
    if (!user) {
      toast.error('Please sign in to upload tracks');
      return;
    }
    if (!isAdmin) {
      toast.error('Only admins can upload tracks');
      return;
    }
    setShowUploader(true);
  };

  const handleManageClick = () => {
    if (!user) {
      toast.error('Please sign in to manage tracks');
      return;
    }
    if (!isAdmin) {
      toast.error('Only admins can manage tracks');
      return;
    }
    setShowAdmin(true);
  };

  const handleTrackClick = (index: number) => {
    skipTo(index);
    openVisualizer();
  };

  const getTrackImage = (index: number) => {
    return defaultImages[index % defaultImages.length];
  };

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

          {/* Dynamic Track Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12"
          >
            {tracks.length > 0 ? (
              tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredTrack(index)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  onClick={() => handleTrackClick(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border-hermetic bg-card/50 backdrop-blur-sm">
                    <img
                      src={getTrackImage(index)}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-background/60 transition-opacity duration-300 ${
                      hoveredTrack === index ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <Play className="h-10 w-10 text-primary mb-2" />
                        <span className="text-primary font-display text-sm text-center">Enter Chamber</span>
                      </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Track Info */}
                  <div className="mt-3 text-center">
                    <h3 className="text-sm font-display text-foreground truncate">{track.title}</h3>
                    {track.frequency && (
                      <p className="text-xs text-primary text-glow-cyan">{track.frequency}</p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No tracks available yet.</p>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground mt-2">Click "Upload Music" to add tracks.</p>
                )}
              </div>
            )}
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
              onClick={openVisualizer}
            >
              <Maximize2 className="h-5 w-5 mr-2" />
              Open Fullscreen Visualizer
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="hermetic"
                  size="xl"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Music
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleManageClick}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Tracks
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <FullscreenVisualizer />

      {showUploader && (
        <AudioUploader
          onUploadComplete={() => {
            setShowUploader(false);
            fetchTracks();
          }}
          onClose={() => setShowUploader(false)}
        />
      )}

      {showAdmin && (
        <TrackAdmin onClose={() => {
          setShowAdmin(false);
          fetchTracks();
        }} />
      )}
    </>
  );
};

export default FrequencyChamber;