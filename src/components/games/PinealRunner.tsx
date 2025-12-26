import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playCoin: () => void;
  playJump: () => void;
  playHit: () => void;
  playFail: () => void;
  playLevelUp: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const LANE_COUNT = 3;
const GAME_SPEED = 50;

type Obstacle = {
  id: string;
  lane: number;
  y: number;
  type: "guardian" | "coin";
};

const PinealRunner = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [playerLane, setPlayerLane] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("pineal-highscore");
    return saved ? parseInt(saved) : 0;
  });
  const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  const resetGame = useCallback(() => {
    setPlayerLane(1);
    setDistance(0);
    setCoins(0);
    setObstacles([]);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (distance > highScore) {
      setHighScore(distance);
      localStorage.setItem("pineal-highscore", distance.toString());
    }
    
    if (distance >= 1000 && !badges.includes("Void Surfer")) {
      onEarnBadge("Void Surfer");
      toast.success("🏆 Badge Earned: Void Surfer!", {
        description: "You've transcended 1km of fractal tunnels!",
      });
    }
  }, [distance, highScore, badges, onEarnBadge]);

  useEffect(() => {
    if (!isPlaying) {
      if (gameLoop.current) clearInterval(gameLoop.current);
      return;
    }

    gameLoop.current = setInterval(() => {
      setDistance(d => d + 1);
      
      setObstacles(prev => {
        let newObstacles = prev
          .map(o => ({ ...o, y: o.y + 8 }))
          .filter(o => o.y < 400);

        // Spawn new obstacles
        if (Math.random() < 0.05) {
          newObstacles.push({
            id: `obs-${Date.now()}`,
            lane: Math.floor(Math.random() * LANE_COUNT),
            y: -40,
            type: Math.random() < 0.7 ? "guardian" : "coin",
          });
        }

        return newObstacles;
      });

      // Collision detection
      setObstacles(prev => {
        const playerY = 280;
        const collision = prev.find(
          o => o.lane === playerLane && Math.abs(o.y - playerY) < 30
        );

        if (collision) {
          if (collision.type === "coin") {
            playSound('playCoin');
            setCoins(c => c + 1);
            return prev.filter(o => o.id !== collision.id);
          } else {
            playSound('playHit');
            setIsPlaying(false);
            return prev;
          }
        }
        return prev;
      });
    }, GAME_SPEED);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [isPlaying, playerLane, playSound]);

  const handleSwipe = (direction: "left" | "right") => {
    if (!isPlaying) return;
    playSound('playJump');
    setPlayerLane(prev => {
      if (direction === "left" && prev > 0) return prev - 1;
      if (direction === "right" && prev < 2) return prev + 1;
      return prev;
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handleSwipe("left");
    if (e.key === "ArrowRight") handleSwipe("right");
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Pineal Runner</h2>
          <p className="text-xs text-muted-foreground">Endless fractal run</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{distance}m</p>
            <p className="text-xs text-muted-foreground">Best: {highScore}m</p>
          </div>
          <button
            onClick={() => {
              playSound('playClick');
              resetGame();
            }}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <span className="text-sm text-accent">🪙 {coins}</span>
        <span className="text-sm text-muted-foreground">
          {distance >= 1000 && <Sparkles className="inline w-4 h-4 text-accent" />}
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto bg-gradient-to-b from-purple-900/30 to-cyan-900/30 rounded-xl overflow-hidden"
        style={{ width: "200px", height: "350px" }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX;
          const handleTouchEnd = (ev: TouchEvent) => {
            const endX = ev.changedTouches[0].clientX;
            if (endX < startX - 30) handleSwipe("left");
            if (endX > startX + 30) handleSwipe("right");
            window.removeEventListener("touchend", handleTouchEnd);
          };
          window.addEventListener("touchend", handleTouchEnd);
        }}
      >
        {/* Lanes */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map(lane => (
            <div key={lane} className="flex-1 border-x border-primary/20" />
          ))}
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <motion.div
            key={obs.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-12 h-12 flex items-center justify-center text-2xl"
            style={{
              left: `${obs.lane * 66 + 33}px`,
              top: `${obs.y}px`,
              transform: "translateX(-50%)",
            }}
          >
            {obs.type === "coin" ? "🪙" : "👁️"}
          </motion.div>
        ))}

        {/* Player */}
        <motion.div
          animate={{ left: `${playerLane * 66 + 33}px` }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute w-12 h-12 flex items-center justify-center text-2xl"
          style={{ bottom: "50px", transform: "translateX(-50%)" }}
        >
          🧘
        </motion.div>

        {/* Start overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
            <button
              onClick={() => {
                playSound('playClick');
                resetGame();
                setTimeout(() => setIsPlaying(true), 100);
              }}
              className="p-4 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              <Play className="w-8 h-8 text-primary" />
            </button>
            <p className="mt-4 text-sm text-muted-foreground">Tap or swipe to move</p>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handleSwipe("left")}
          className="px-6 py-3 rounded-lg bg-muted/50 hover:bg-muted text-lg"
        >
          ←
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="px-6 py-3 rounded-lg bg-muted/50 hover:bg-muted text-lg"
        >
          →
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Navigate through the illusions, collect the golden ratio"
      </p>
    </div>
  );
};

export default PinealRunner;
