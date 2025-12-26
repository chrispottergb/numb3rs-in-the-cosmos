import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playHit: () => void;
  playLevelUp: () => void;
  playFail: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

type Ball = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
};

type Brick = {
  id: string;
  x: number;
  y: number;
  hp: number;
};

const CANVAS_WIDTH = 280;
const CANVAS_HEIGHT = 400;
const BALL_SIZE = 10;
const BRICK_WIDTH = 40;
const BRICK_HEIGHT = 20;
const PADDLE_WIDTH = 60;

const BallzOfBeing = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalClears, setTotalClears] = useState(() => {
    const saved = localStorage.getItem("ballz-clears");
    return saved ? parseInt(saved) : 0;
  });
  const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  const initLevel = () => {
    const newBricks: Brick[] = [];
    const rows = Math.min(3 + Math.floor(level / 2), 6);
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newBricks.push({
          id: `brick-${row}-${col}`,
          x: col * (BRICK_WIDTH + 5) + 10,
          y: row * (BRICK_HEIGHT + 5) + 50,
          hp: Math.ceil(level / 2) + row,
        });
      }
    }
    
    setBricks(newBricks);
    setBalls([{
      id: "ball-1",
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      vx: 2,
      vy: -3,
      active: false,
    }]);
    setIsPlaying(false);
  };

  useEffect(() => {
    initLevel();
  }, [level]);

  useEffect(() => {
    localStorage.setItem("ballz-clears", totalClears.toString());
    
    if (totalClears >= 10 && !badges.includes("Sphere Sage")) {
      onEarnBadge("Sphere Sage");
      toast.success("🏆 Badge Earned: Sphere Sage!", {
        description: "10 levels cleared with sacred spheres!",
      });
    }
  }, [totalClears, badges, onEarnBadge]);

  useEffect(() => {
    if (bricks.length === 0 && isPlaying) {
      playSound('playLevelUp');
      setTotalClears(c => c + 1);
      toast.success(`Level ${level} Complete!`);
      setTimeout(() => setLevel(l => l + 1), 1000);
    }
  }, [bricks, isPlaying, level, playSound]);

  useEffect(() => {
    if (!isPlaying) {
      if (gameLoop.current) clearInterval(gameLoop.current);
      return;
    }

    gameLoop.current = setInterval(() => {
      setBalls(prevBalls => {
        return prevBalls.map(ball => {
          if (!ball.active) return ball;
          
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          let newVx = ball.vx;
          let newVy = ball.vy;

          // Wall collisions
          if (newX <= BALL_SIZE / 2 || newX >= CANVAS_WIDTH - BALL_SIZE / 2) {
            newVx = -newVx;
            newX = Math.max(BALL_SIZE / 2, Math.min(CANVAS_WIDTH - BALL_SIZE / 2, newX));
          }
          if (newY <= BALL_SIZE / 2) {
            newVy = -newVy;
            newY = BALL_SIZE / 2;
          }

          // Paddle collision
          if (newY >= CANVAS_HEIGHT - 30 && newY <= CANVAS_HEIGHT - 20) {
            if (newX >= paddleX && newX <= paddleX + PADDLE_WIDTH) {
              newVy = -Math.abs(newVy);
              const hitPos = (newX - paddleX) / PADDLE_WIDTH;
              newVx = (hitPos - 0.5) * 6;
            }
          }

          // Ball lost
          if (newY >= CANVAS_HEIGHT) {
            playSound('playFail');
            setIsPlaying(false);
            toast.error("Ball lost!", { description: "Try again!" });
            return { ...ball, active: false };
          }

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        });
      });

      // Brick collisions
      setBricks(prevBricks => {
        return prevBricks.filter(brick => {
          const ballHit = balls.some(ball => {
            if (!ball.active) return false;
            const hitX = ball.x >= brick.x && ball.x <= brick.x + BRICK_WIDTH;
            const hitY = ball.y >= brick.y && ball.y <= brick.y + BRICK_HEIGHT;
            return hitX && hitY;
          });
          
          if (ballHit) {
            playSound('playHit');
            setScore(s => s + 10);
            if (brick.hp <= 1) {
              return false;
            }
            brick.hp -= 1;
          }
          return true;
        });
      });
    }, 16);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [isPlaying, paddleX, balls, playSound]);

  const launchBall = () => {
    if (balls.some(b => b.active)) return;
    playSound('playClick');
    setBalls(prev => prev.map(b => ({ ...b, active: true })));
    setIsPlaying(true);
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setPaddleX(Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2)));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Ballz of Being</h2>
          <p className="text-xs text-muted-foreground">Level {level}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{score}</p>
            <p className="text-xs text-muted-foreground">Clears: {totalClears}</p>
          </div>
          <button
            onClick={() => {
              playSound('playClick');
              initLevel();
            }}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        {totalClears >= 10 && <Sparkles className="inline w-4 h-4 text-accent" />}
      </div>

      {/* Game Canvas */}
      <div
        ref={containerRef}
        className="relative mx-auto bg-gradient-to-b from-purple-900/20 to-cyan-900/20 rounded-xl border border-border/50 overflow-hidden cursor-none"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onClick={launchBall}
      >
        {/* Bricks */}
        {bricks.map(brick => (
          <motion.div
            key={brick.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute rounded flex items-center justify-center text-xs font-bold"
            style={{
              left: brick.x,
              top: brick.y,
              width: BRICK_WIDTH,
              height: BRICK_HEIGHT,
              background: `linear-gradient(135deg, hsl(${180 + brick.hp * 20}, 70%, 50%), hsl(${220 + brick.hp * 20}, 70%, 40%))`,
            }}
          >
            {brick.hp}
          </motion.div>
        ))}

        {/* Balls */}
        {balls.map(ball => (
          <motion.div
            key={ball.id}
            animate={{ x: ball.x - BALL_SIZE / 2, y: ball.y - BALL_SIZE / 2 }}
            className="absolute rounded-full bg-gradient-to-br from-primary to-accent"
            style={{ width: BALL_SIZE, height: BALL_SIZE }}
          />
        ))}

        {/* Paddle */}
        <div
          className="absolute bottom-5 rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            left: paddleX,
            width: PADDLE_WIDTH,
            height: 10,
          }}
        />

        {/* Start overlay */}
        {!balls.some(b => b.active) && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <button
              onClick={launchBall}
              className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              <Play className="w-6 h-6 text-primary" />
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Launch sacred spheres to shatter illusion bricks"
      </p>
    </div>
  );
};

export default BallzOfBeing;
