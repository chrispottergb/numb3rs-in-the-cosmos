import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playMatch: () => void;
  playCombo: () => void;
  playLevelUp: () => void;
  playFail: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const GRID_SIZE = 5;
const JEWEL_TYPES = ["💎", "🔮", "⭐", "💠", "🌟"];
const COLORS = ["bg-cyan-500/30", "bg-purple-500/30", "bg-yellow-500/30", "bg-pink-500/30", "bg-blue-500/30"];

type Cell = {
  type: number;
  id: string;
  selected: boolean;
  matched: boolean;
};

const RoyalMerkaba = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("merkaba-level");
    return saved ? parseInt(saved) : 1;
  });
  const [moves, setMoves] = useState(20);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(100);

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          type: Math.floor(Math.random() * JEWEL_TYPES.length),
          id: `${i}-${j}-${Date.now()}-${Math.random()}`,
          selected: false,
          matched: false,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(initGrid());
    setMoves(20 + Math.floor(level / 5) * 5);
    setScore(0);
    setTargetScore(100 + (level - 1) * 50);
  }, [level, initGrid]);

  useEffect(() => {
    localStorage.setItem("merkaba-level", level.toString());
    
    if (level >= 50 && !badges.includes("Throne Aligner")) {
      onEarnBadge("Throne Aligner");
      toast.success("🏆 Badge Earned: Throne Aligner!", {
        description: "50 levels of crystal consciousness!",
      });
    }
  }, [level, badges, onEarnBadge]);

  useEffect(() => {
    if (score >= targetScore) {
      playSound('playLevelUp');
      toast.success(`Level ${level} Complete!`, {
        description: "Your crystal palace grows stronger!",
      });
      setTimeout(() => setLevel(l => l + 1), 1000);
    } else if (moves <= 0 && score < targetScore) {
      playSound('playFail');
      toast.error("Level Failed", {
        description: "The density veils prevail...",
      });
      setTimeout(() => {
        setGrid(initGrid());
        setMoves(20 + Math.floor(level / 5) * 5);
        setScore(0);
      }, 1000);
    }
  }, [score, targetScore, moves, level, initGrid, playSound]);

  const handleCellClick = (row: number, col: number) => {
    if (moves <= 0) return;
    playSound('playClick');
    
    if (!selected) {
      setSelected({ row, col });
      const newGrid = [...grid];
      newGrid[row][col].selected = true;
      setGrid(newGrid);
    } else {
      const isAdjacent = 
        (Math.abs(selected.row - row) === 1 && selected.col === col) ||
        (Math.abs(selected.col - col) === 1 && selected.row === row);

      if (isAdjacent) {
        setMoves(m => m - 1);
        swapAndCheck(selected.row, selected.col, row, col);
      }
      
      const newGrid = grid.map(r => r.map(c => ({ ...c, selected: false })));
      setGrid(newGrid);
      setSelected(null);
    }
  };

  const swapAndCheck = (r1: number, c1: number, r2: number, c2: number) => {
    const newGrid = [...grid.map(r => [...r])];
    [newGrid[r1][c1], newGrid[r2][c2]] = [newGrid[r2][c2], newGrid[r1][c1]];
    
    const matchedCells = findMatches(newGrid);
    if (matchedCells.length > 0) {
      clearMatches(newGrid, matchedCells);
    } else {
      playSound('playFail');
      [newGrid[r1][c1], newGrid[r2][c2]] = [newGrid[r2][c2], newGrid[r1][c1]];
      setGrid(newGrid);
    }
  };

  const findMatches = (g: Cell[][]): { row: number; col: number }[] => {
    const matched: { row: number; col: number }[] = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (g[i][j].type === g[i][j + 1].type && g[i][j].type === g[i][j + 2].type) {
          matched.push({ row: i, col: j }, { row: i, col: j + 1 }, { row: i, col: j + 2 });
        }
      }
    }
    
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (g[i][j].type === g[i + 1][j].type && g[i][j].type === g[i + 2][j].type) {
          matched.push({ row: i, col: j }, { row: i + 1, col: j }, { row: i + 2, col: j });
        }
      }
    }
    
    return matched;
  };

  const clearMatches = (g: Cell[][], matchedCells: { row: number; col: number }[]) => {
    const newGrid = [...g.map(r => [...r])];
    const uniqueMatches = new Set(matchedCells.map(c => `${c.row}-${c.col}`));
    
    // Play combo sound if more than 3 matches
    if (uniqueMatches.size > 3) {
      playSound('playCombo');
    } else {
      playSound('playMatch');
    }
    
    uniqueMatches.forEach(key => {
      const [row, col] = key.split("-").map(Number);
      newGrid[row][col].matched = true;
    });
    
    setGrid(newGrid);
    setScore(s => s + uniqueMatches.size * 10);
    
    setTimeout(() => {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newGrid.map(row => row[col]).filter(c => !c.matched);
        const newCells = Array(GRID_SIZE - column.length).fill(null).map(() => ({
          type: Math.floor(Math.random() * JEWEL_TYPES.length),
          id: `new-${Date.now()}-${Math.random()}`,
          selected: false,
          matched: false,
        }));
        const fullColumn = [...newCells, ...column];
        fullColumn.forEach((cell, i) => {
          newGrid[i][col] = cell;
        });
      }
      setGrid(newGrid);
      
      // Check for cascades
      setTimeout(() => {
        const cascadeMatches = findMatches(newGrid);
        if (cascadeMatches.length > 0) {
          clearMatches(newGrid, cascadeMatches);
        }
      }, 200);
    }, 300);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Royal Merkaba</h2>
          <p className="text-xs text-muted-foreground">Level {level}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{score}/{targetScore}</p>
            <p className="text-xs text-muted-foreground">{moves} moves</p>
          </div>
          <button
            onClick={() => {
              playSound('playClick');
              setGrid(initGrid());
              setMoves(20 + Math.floor(level / 5) * 5);
              setScore(0);
            }}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-4">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
          style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {level >= 50 && <Sparkles className="inline w-4 h-4 text-accent" />}
          Build your crystal palace
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <motion.button
                key={cell.id}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: cell.matched ? 0 : 1,
                  opacity: cell.matched ? 0 : 1,
                }}
                onClick={() => handleCellClick(i, j)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-2xl transition-all duration-200
                  ${cell.selected ? "ring-2 ring-primary scale-110" : ""}
                  ${COLORS[cell.type]}
                  hover:scale-105 active:scale-95
                `}
              >
                {JEWEL_TYPES[cell.type]}
              </motion.button>
            ))
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Align the jewels within Metatron's Cube"
      </p>
    </div>
  );
};

export default RoyalMerkaba;
