import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playCoin: () => void;
  playFail: () => void;
  playLevelUp: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };

const SpiralSnake = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snake-highscore");
    return saved ? parseInt(saved) : 0;
  });
  const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snake-highscore", score.toString());
    }
    
    if (score >= 100 && !badges.includes("Coil Master")) {
      onEarnBadge("Coil Master");
      toast.success("🏆 Badge Earned: Coil Master!", {
        description: "Your Fibonacci snake has reached length 100!",
      });
    }
  }, [score, highScore, badges, onEarnBadge]);

  const spawnFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setDirection({ x: 1, y: 0 });
    setFood(spawnFood([{ x: 7, y: 7 }]));
    setScore(0);
    setIsPlaying(false);
  }, [spawnFood]);

  useEffect(() => {
    if (!isPlaying) {
      if (gameLoop.current) clearInterval(gameLoop.current);
      return;
    }

    gameLoop.current = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check self collision
        if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          playSound('playFail');
          setIsPlaying(false);
          toast.error("Game Over!", { description: `Final Score: ${score}` });
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          playSound('playCoin');
          setScore(s => s + 1);
          setFood(spawnFood(newSnake));
          return newSnake; // Don't remove tail = grow
        }

        return newSnake.slice(0, -1); // Remove tail
      });
    }, INITIAL_SPEED);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [isPlaying, food, spawnFood, score, playSound]);

  const handleDirection = useCallback((newDir: Position) => {
    // Prevent 180 degree turns
    if (newDir.x === -directionRef.current.x && newDir.y === -directionRef.current.y) return;
    setDirection(newDir);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": handleDirection({ x: 0, y: -1 }); break;
        case "ArrowDown": handleDirection({ x: 0, y: 1 }); break;
        case "ArrowLeft": handleDirection({ x: -1, y: 0 }); break;
        case "ArrowRight": handleDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDirection]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Spiral Snake</h2>
          <p className="text-xs text-muted-foreground">Fibonacci growth game</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{score}</p>
            <p className="text-xs text-muted-foreground">Best: {highScore}</p>
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

      <div className="text-center mb-4">
        {score >= 100 && <Sparkles className="inline w-4 h-4 text-accent" />}
      </div>

      {/* Game Board */}
      <div
        className="relative mx-auto bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg border border-border/50"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              background: i === 0 
                ? "linear-gradient(135deg, hsl(187, 100%, 50%), hsl(45, 100%, 50%))"
                : `linear-gradient(135deg, hsl(187, 100%, ${50 - i * 2}%), hsl(270, 50%, ${40 - i}%))`,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute rounded-full bg-accent flex items-center justify-center text-xs"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1,
          }}
        >
          ✨
        </motion.div>

        {/* Start overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
            <button
              onClick={() => {
                playSound('playClick');
                if (snake.length === 1 && score === 0) {
                  setIsPlaying(true);
                } else {
                  resetGame();
                  setTimeout(() => setIsPlaying(true), 100);
                }
              }}
              className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              <Play className="w-6 h-6 text-primary" />
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              {score > 0 ? "Play Again" : "Start Game"}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <button
          onClick={() => handleDirection({ x: 0, y: -1 })}
          className="px-6 py-2 rounded-lg bg-muted/50 hover:bg-muted"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleDirection({ x: -1, y: 0 })}
            className="px-6 py-2 rounded-lg bg-muted/50 hover:bg-muted"
          >
            ←
          </button>
          <button
            onClick={() => handleDirection({ x: 1, y: 0 })}
            className="px-6 py-2 rounded-lg bg-muted/50 hover:bg-muted"
          >
            →
          </button>
        </div>
        <button
          onClick={() => handleDirection({ x: 0, y: 1 })}
          className="px-6 py-2 rounded-lg bg-muted/50 hover:bg-muted"
        >
          ↓
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Grow your consciousness in the spiral of life"
      </p>
    </div>
  );
};

export default SpiralSnake;
