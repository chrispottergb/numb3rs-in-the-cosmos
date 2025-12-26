import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GamesMusicWidget from "@/components/GamesMusicWidget";
import MetatronMatcher from "@/components/games/MetatronMatcher";
import PinealRunner from "@/components/games/PinealRunner";
import VoidClicker from "@/components/games/VoidClicker";
import FractalBrawler from "@/components/games/FractalBrawler";
import TorusTapTitans from "@/components/games/TorusTapTitans";
import SpiralSnake from "@/components/games/SpiralSnake";
import RoyalMerkaba from "@/components/games/RoyalMerkaba";
import EggOfOmniscience from "@/components/games/EggOfOmniscience";
import BallzOfBeing from "@/components/games/BallzOfBeing";
import ToonToroids from "@/components/games/ToonToroids";
import { Gamepad2, Trophy, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useGameSounds } from "@/hooks/useGameSounds";
const games = [
  { id: "metatron", name: "Metatron Matcher", component: MetatronMatcher, description: "Match sacred geometry orbs", badge: "Cube Awakener" },
  { id: "pineal", name: "Pineal Runner", component: PinealRunner, description: "Endless fractal run", badge: "Void Surfer" },
  { id: "void", name: "Void Clicker", component: VoidClicker, description: "Tap consciousness quanta", badge: "Ascension Crest" },
  { id: "fractal", name: "Fractal Brawler", component: FractalBrawler, description: "3v3 sacred battles", badge: "Unity Warrior" },
  { id: "torus", name: "Torus Tap Titans", component: TorusTapTitans, description: "Idle hero progression", badge: "Eternal Flame" },
  { id: "spiral", name: "Spiral Snake", component: SpiralSnake, description: "Fibonacci growth", badge: "Coil Master" },
  { id: "royal", name: "Royal Merkaba", component: RoyalMerkaba, description: "Crystal palace puzzles", badge: "Throne Aligner" },
  { id: "egg", name: "Egg of Omniscience", component: EggOfOmniscience, description: "Hatch awareness farms", badge: "Genesis Nester" },
  { id: "ballz", name: "Ballz of Being", component: BallzOfBeing, description: "Sacred sphere physics", badge: "Sphere Sage" },
  { id: "toon", name: "Toon Toroids", component: ToonToroids, description: "Blast cosmic shapes", badge: "Blast Bodhi" },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false); // Disabled by default to avoid unexpected beeps
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem("sacred-badges");
    return saved ? JSON.parse(saved) : [];
  });

  const gameSounds = useGameSounds();

  const earnBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      const newBadges = [...badges, badge];
      setBadges(newBadges);
      localStorage.setItem("sacred-badges", JSON.stringify(newBadges));
      if (soundEnabled) {
        gameSounds.playBadge();
      }
    }
  };

  const handleGameSelect = (gameId: string) => {
    if (soundEnabled) {
      gameSounds.playClick();
    }
    setActiveGame(gameId);
  };

  const ActiveGameComponent = activeGame 
    ? games.find(g => g.id === activeGame)?.component 
    : null;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <GamesMusicWidget />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
              <h1 className="text-3xl md:text-5xl font-display text-gradient-sacred">
                Sacred Play Portal
              </h1>
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elevate your consciousness through sacred geometry gaming. 
              Earn badges to unlock exclusive frequency tracks.
            </p>
            
            {/* Badge Counter & Sound Toggle */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-accent font-medium">
                  {badges.length} / {games.length} Badges Earned
                </span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-accent" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Active Game or Game Grid */}
          {activeGame && ActiveGameComponent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <button
                onClick={() => {
                  if (soundEnabled) gameSounds.playClick();
                  setActiveGame(null);
                }}
                className="mb-4 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                ← Back to Portal
              </button>
              <div className="bg-card/50 rounded-2xl border border-border/50 overflow-hidden">
                <ActiveGameComponent 
                  onEarnBadge={earnBadge} 
                  badges={badges} 
                  soundEnabled={soundEnabled}
                  gameSounds={gameSounds}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {games.map((game, index) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleGameSelect(game.id)}
                  className="group relative p-4 bg-card/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 text-left"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon */}
                  <div className="relative mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="relative text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="relative text-xs text-muted-foreground">
                    {game.description}
                  </p>
                  
                  {/* Badge indicator */}
                  {badges.includes(game.badge) && (
                    <div className="absolute top-2 right-2">
                      <Trophy className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Earned Badges Section */}
          {badges.length > 0 && !activeGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 bg-card/30 rounded-2xl border border-border/30"
            >
              <h2 className="text-xl font-display text-center mb-4 text-gradient-sacred">
                Your Consciousness Badges
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge}
                    className="px-4 py-2 bg-accent/20 rounded-full border border-accent/50 text-accent text-sm font-medium"
                  >
                    <Trophy className="w-3 h-3 inline mr-2" />
                    {badge}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Games;
