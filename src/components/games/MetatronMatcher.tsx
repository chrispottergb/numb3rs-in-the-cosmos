import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playMatch: () => void;
  playLevelUp: () => void;
  playBadge: () => void;
  playCombo: () => void;
  playFail: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const GRID_SIZE = 6;
const SHAPES = ["tetrahedron", "merkaba", "cube", "octahedron", "dodeca"];
const COLORS = ["text-primary", "text-accent", "text-purple-400", "text-cyan-300", "text-amber-400"];

type Cell = {
  shape: number;
  id: string;
  selected: boolean;
  matched: boolean;
};

const MetatronMatcher = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("metatron-score");
    return saved ? parseInt(saved) : 0;
  });
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("metatron-matches");
    return saved ? parseInt(saved) : 0;
  });

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
          shape: Math.floor(Math.random() * SHAPES.length),
          id: `${i}-${j}-${Date.now()}`,
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
  }, [initGrid]);

  useEffect(() => {
    localStorage.setItem("metatron-score", score.toString());
    localStorage.setItem("metatron-matches", matches.toString());
    
    if (matches >= 100 && !badges.includes("Cube Awakener")) {
      onEarnBadge("Cube Awakener");
      toast.success("🏆 Badge Earned: Cube Awakener!", {
        description: "Your third eye begins to open...",
      });
    }
  }, [score, matches, badges, onEarnBadge]);

  const handleCellClick = (row: number, col: number) => {
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
        if (g[i][j].shape === g[i][j + 1].shape && g[i][j].shape === g[i][j + 2].shape) {
          matched.push({ row: i, col: j }, { row: i, col: j + 1 }, { row: i, col: j + 2 });
        }
      }
    }
    
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (g[i][j].shape === g[i + 1][j].shape && g[i][j].shape === g[i + 2][j].shape) {
          matched.push({ row: i, col: j }, { row: i + 1, col: j }, { row: i + 2, col: j });
        }
      }
    }
    
    return matched;
  };

  const clearMatches = (g: Cell[][], matchedCells: { row: number; col: number }[]) => {
    const newGrid = [...g.map(r => [...r])];
    const uniqueMatches = new Set(matchedCells.map(c => `${c.row}-${c.col}`));
    
    // Play match sound, combo if more than 3
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
    setMatches(m => m + Math.floor(uniqueMatches.size / 3));
    
    setTimeout(() => {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newGrid.map(row => row[col]).filter(c => !c.matched);
        const newCells = Array(GRID_SIZE - column.length).fill(null).map(() => ({
          shape: Math.floor(Math.random() * SHAPES.length),
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
    }, 300);
  };

  const getShapeIcon = (shape: number) => {
    const shapes = ["◇", "✡", "□", "◈", "⬡"];
    return shapes[shape] || "○";
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Metatron Matcher</h2>
          <p className="text-xs text-muted-foreground">Match 3+ sacred shapes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{score}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <button
            onClick={() => {
              playSound('playClick');
              setGrid(initGrid());
            }}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <p className="text-sm text-muted-foreground">
          Matches: {matches}/100 {matches >= 100 && <Sparkles className="inline w-4 h-4 text-accent" />}
        </p>
      </div>

      <div className="grid gap-1 mx-auto" style={{ maxWidth: "320px" }}>
        {grid.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((cell, j) => (
              <motion.button
                key={cell.id}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: cell.matched ? 0 : 1,
                  opacity: cell.matched ? 0 : 1,
                }}
                onClick={() => handleCellClick(i, j)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl transition-all duration-200
                  ${cell.selected ? "bg-primary/30 ring-2 ring-primary" : "bg-card/80"}
                  ${COLORS[cell.shape]}
                  hover:bg-card active:scale-95
                `}
              >
                {getShapeIcon(cell.shape)}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Clear the ego blocks, align with cosmic flow"
      </p>
    </div>
  );
};

export default MetatronMatcher;
