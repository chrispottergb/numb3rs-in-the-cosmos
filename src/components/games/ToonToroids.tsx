import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Bomb } from "lucide-react";
import { toast } from "sonner";

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
}

const GRID_SIZE = 7;
const SHAPES = ["🔵", "🟣", "🟡", "🟢", "🔴"];
const MIN_CLUSTER = 2;

type Cell = {
  shape: number;
  id: string;
  popping: boolean;
};

const ToonToroids = ({ onEarnBadge, badges }: GameProps) => {
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [totalCombos, setTotalCombos] = useState(() => {
    const saved = localStorage.getItem("toon-combos");
    return saved ? parseInt(saved) : 0;
  });

  const initGrid = useCallback(() => {
    const newGrid: (Cell | null)[][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row: (Cell | null)[] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          shape: Math.floor(Math.random() * SHAPES.length),
          id: `${i}-${j}-${Date.now()}-${Math.random()}`,
          popping: false,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(initGrid());
    setMoves(30 + level * 5);
    setScore(0);
    setCombo(0);
  }, [level, initGrid]);

  useEffect(() => {
    localStorage.setItem("toon-combos", totalCombos.toString());
    
    if (totalCombos >= 50 && !badges.includes("Blast Bodhi")) {
      onEarnBadge("Blast Bodhi");
      toast.success("🏆 Badge Earned: Blast Bodhi!", {
        description: "50 cosmic combos achieved!",
      });
    }
  }, [totalCombos, badges, onEarnBadge]);

  const findCluster = (row: number, col: number, shape: number, visited: Set<string>): { row: number; col: number }[] => {
    const key = `${row}-${col}`;
    if (
      row < 0 || row >= GRID_SIZE ||
      col < 0 || col >= GRID_SIZE ||
      visited.has(key) ||
      !grid[row][col] ||
      grid[row][col]?.shape !== shape
    ) {
      return [];
    }

    visited.add(key);
    const cluster = [{ row, col }];

    cluster.push(...findCluster(row - 1, col, shape, visited));
    cluster.push(...findCluster(row + 1, col, shape, visited));
    cluster.push(...findCluster(row, col - 1, shape, visited));
    cluster.push(...findCluster(row, col + 1, shape, visited));

    return cluster;
  };

  const handleCellClick = (row: number, col: number) => {
    if (moves <= 0) return;
    const cell = grid[row][col];
    if (!cell) return;

    const cluster = findCluster(row, col, cell.shape, new Set());
    
    if (cluster.length >= MIN_CLUSTER) {
      setMoves(m => m - 1);
      
      // Mark cells for popping
      const newGrid = grid.map(r => r.map(c => c ? { ...c } : null));
      cluster.forEach(({ row: r, col: c }) => {
        if (newGrid[r][c]) {
          newGrid[r][c]!.popping = true;
        }
      });
      setGrid(newGrid);

      // Calculate combo bonus
      const comboBonus = cluster.length > 3 ? cluster.length - 3 : 0;
      const points = cluster.length * 10 * (1 + comboBonus * 0.5);
      setScore(s => s + Math.floor(points));
      
      if (comboBonus > 0) {
        setCombo(c => c + 1);
        setTotalCombos(t => t + 1);
        toast.success(`Combo x${comboBonus + 1}!`, { duration: 1000 });
      }

      // Remove and drop
      setTimeout(() => {
        const clearedGrid = newGrid.map(r => r.map(c => c?.popping ? null : c));
        
        // Gravity - drop cells down
        for (let col = 0; col < GRID_SIZE; col++) {
          const column = clearedGrid.map(r => r[col]).filter(c => c !== null);
          const newColumn = [
            ...Array(GRID_SIZE - column.length).fill(null).map(() => ({
              shape: Math.floor(Math.random() * SHAPES.length),
              id: `new-${Date.now()}-${Math.random()}`,
              popping: false,
            })),
            ...column,
          ];
          newColumn.forEach((cell, i) => {
            clearedGrid[i][col] = cell;
          });
        }
        
        setGrid(clearedGrid);
      }, 200);
    }
  };

  const targetScore = level * 500;
  const progress = Math.min(100, (score / targetScore) * 100);

  useEffect(() => {
    if (score >= targetScore) {
      toast.success(`Level ${level} Complete!`);
      setTimeout(() => setLevel(l => l + 1), 1000);
    } else if (moves <= 0 && score < targetScore) {
      toast.error("Level Failed!");
      setTimeout(() => {
        setGrid(initGrid());
        setMoves(30 + level * 5);
        setScore(0);
      }, 1000);
    }
  }, [score, targetScore, moves, level, initGrid]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Toon Toroids</h2>
          <p className="text-xs text-muted-foreground">Level {level}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{score}/{targetScore}</p>
            <p className="text-xs text-muted-foreground">{moves} taps</p>
          </div>
          <button
            onClick={() => {
              setGrid(initGrid());
              setMoves(30 + level * 5);
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
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Combos: {totalCombos}/50
          {totalCombos >= 50 && <Sparkles className="inline w-4 h-4 ml-1 text-accent" />}
        </p>
      </div>

      {/* Game Grid */}
      <div className="flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <motion.button
                key={cell?.id || `empty-${i}-${j}`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: cell?.popping ? 1.3 : 1,
                  opacity: cell?.popping ? 0 : 1,
                }}
                onClick={() => handleCellClick(i, j)}
                disabled={!cell}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-xl md:text-2xl transition-all duration-200
                  ${cell ? "bg-card/50 hover:bg-card active:scale-95" : "bg-transparent"}
                `}
              >
                {cell && SHAPES[cell.shape]}
              </motion.button>
            ))
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Blast clusters of cosmic shapes for mega explosions"
      </p>
    </div>
  );
};

export default ToonToroids;
