import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Egg, Zap, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playPowerup: () => void;
  playLevelUp: () => void;
  playCoin: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const EGGS = [
  { id: "sphere", name: "Sphere Egg", emoji: "🥚", value: 1, cost: 0 },
  { id: "tetra", name: "Tetra Egg", emoji: "🔺", value: 5, cost: 100 },
  { id: "cube", name: "Cube Egg", emoji: "⬜", value: 25, cost: 1000 },
  { id: "octa", name: "Octa Egg", emoji: "💠", value: 125, cost: 10000 },
  { id: "dodeca", name: "Dodeca Egg", emoji: "⭐", value: 625, cost: 100000 },
];

const DRONES = [
  { id: "basic", name: "Basic Drone", multiplier: 2, cost: 500 },
  { id: "advanced", name: "Advanced Drone", multiplier: 5, cost: 5000 },
  { id: "quantum", name: "Quantum Drone", multiplier: 20, cost: 50000 },
];

const EggOfOmniscience = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [eggs, setEggs] = useState(() => {
    const saved = localStorage.getItem("egg-eggs");
    return saved ? parseFloat(saved) : 0;
  });
  const [totalEggs, setTotalEggs] = useState(() => {
    const saved = localStorage.getItem("egg-total");
    return saved ? parseFloat(saved) : 0;
  });
  const [farms, setFarms] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("egg-farms");
    return saved ? JSON.parse(saved) : { sphere: 1 };
  });
  const [drones, setDrones] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("egg-drones");
    return saved ? JSON.parse(saved) : {};
  });
  const [dimension, setDimension] = useState(() => {
    const saved = localStorage.getItem("egg-dimension");
    return saved ? parseInt(saved) : 1;
  });

  const droneMultiplier = DRONES.reduce((mult, d) => mult + (drones[d.id] || 0) * (d.multiplier - 1), 1);
  const eps = EGGS.reduce((sum, e) => sum + (farms[e.id] || 0) * e.value, 0) * dimension * droneMultiplier;

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  useEffect(() => {
    localStorage.setItem("egg-eggs", eggs.toString());
    localStorage.setItem("egg-total", totalEggs.toString());
    localStorage.setItem("egg-farms", JSON.stringify(farms));
    localStorage.setItem("egg-drones", JSON.stringify(drones));
    localStorage.setItem("egg-dimension", dimension.toString());
  }, [eggs, totalEggs, farms, drones, dimension]);

  useEffect(() => {
    if (dimension >= 3 && !badges.includes("Genesis Nester")) {
      onEarnBadge("Genesis Nester");
      toast.success("🏆 Badge Earned: Genesis Nester!", {
        description: "You've ascended to the 3rd dimension!",
      });
    }
  }, [dimension, badges, onEarnBadge]);

  // Egg production
  useEffect(() => {
    const interval = setInterval(() => {
      if (eps > 0) {
        setEggs(e => e + eps / 10);
        setTotalEggs(t => t + eps / 10);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [eps]);

  const hatchEgg = () => {
    playSound('playClick');
    setEggs(e => e + dimension * droneMultiplier);
    setTotalEggs(t => t + dimension * droneMultiplier);
  };

  const buyFarm = (eggId: string, cost: number) => {
    if (eggs >= cost) {
      playSound('playPowerup');
      setEggs(e => e - cost);
      setFarms(f => ({ ...f, [eggId]: (f[eggId] || 0) + 1 }));
    }
  };

  const buyDrone = (droneId: string, cost: number) => {
    if (eggs >= cost) {
      playSound('playPowerup');
      setEggs(e => e - cost);
      setDrones(d => ({ ...d, [droneId]: (d[droneId] || 0) + 1 }));
    }
  };

  const getFarmCost = (base: number, owned: number) => {
    return Math.floor(base * Math.pow(1.12, owned)) || 10;
  };

  const canPrestige = totalEggs >= 1000000;

  const handlePrestige = () => {
    if (canPrestige) {
      playSound('playLevelUp');
      setDimension(d => d + 1);
      setEggs(0);
      setTotalEggs(0);
      setFarms({ sphere: 1 });
      setDrones({});
      toast.success("🌟 Dimension Shift!", {
        description: `Welcome to dimension ${dimension + 1}!`,
      });
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1e12) return (n / 1e12).toFixed(1) + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return Math.floor(n).toString();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Egg of Omniscience</h2>
          <p className="text-xs text-muted-foreground">Dimension {dimension}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">🥚 {formatNumber(eggs)}</p>
          <p className="text-xs text-muted-foreground">{formatNumber(eps)} /sec</p>
        </div>
      </div>

      {dimension > 1 && (
        <div className="text-center mb-4">
          <span className="text-sm text-purple-400">
            ✨ Dimension {dimension} (x{dimension} base)
          </span>
        </div>
      )}

      {/* Main Egg Tapper */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={hatchEgg}
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border-2 border-accent/50 flex items-center justify-center group"
        >
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse" />
          <span className="text-5xl md:text-6xl relative">🥚</span>
        </motion.button>
      </div>

      {/* Farms */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Egg className="w-4 h-4" /> Awareness Farms
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {EGGS.slice(1).map(egg => {
            const owned = farms[egg.id] || 0;
            const cost = getFarmCost(egg.cost, owned);
            const canAfford = eggs >= cost;
            
            return (
              <button
                key={egg.id}
                onClick={() => buyFarm(egg.id, cost)}
                disabled={!canAfford}
                className={`p-2 rounded-lg border transition-all text-left ${
                  canAfford 
                    ? "bg-card/50 border-accent/30 hover:border-accent/50" 
                    : "bg-muted/30 border-border/30 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{egg.emoji} {egg.name}</span>
                  <span className="text-xs text-accent">{owned}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatNumber(cost)} | +{egg.value}/s
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drones */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">🤖 Drone Swarms</h3>
        <div className="space-y-2">
          {DRONES.map(drone => {
            const owned = drones[drone.id] || 0;
            const cost = getFarmCost(drone.cost, owned);
            const canAfford = eggs >= cost;
            
            return (
              <button
                key={drone.id}
                onClick={() => buyDrone(drone.id, cost)}
                disabled={!canAfford}
                className={`w-full p-2 rounded-lg border transition-all flex items-center justify-between ${
                  canAfford 
                    ? "bg-card/50 border-primary/30 hover:border-primary/50" 
                    : "bg-muted/30 border-border/30 opacity-50"
                }`}
              >
                <span className="text-sm">{drone.name} (x{drone.multiplier})</span>
                <div className="text-right">
                  <span className="text-xs text-accent">{owned}</span>
                  <span className="text-xs text-muted-foreground ml-2">{formatNumber(cost)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prestige */}
      <button
        onClick={handlePrestige}
        disabled={!canPrestige}
        className={`w-full p-3 rounded-lg border transition-all ${
          canPrestige
            ? "bg-purple-500/20 border-purple-500/50 hover:border-purple-500"
            : "bg-muted/20 border-border/30 opacity-50"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Shift Dimension (1M eggs)</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Reset for permanent x{dimension + 1} multiplier
        </p>
      </button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Hatch platonic eggs into awareness farms"
      </p>
    </div>
  );
};

export default EggOfOmniscience;
