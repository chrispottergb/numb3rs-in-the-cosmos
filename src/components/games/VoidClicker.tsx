import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playMatch: () => void;
  playLevelUp: () => void;
  playBadge: () => void;
  playPowerup: () => void;
  playCoin: () => void;
}

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
  soundEnabled?: boolean;
  gameSounds?: GameSounds;
}

const UPGRADES = [
  { id: "seraphim", name: "Seraphim Baker", cost: 50, cps: 1 },
  { id: "cherubim", name: "Cherubim Weaver", cost: 200, cps: 5 },
  { id: "throne", name: "Throne Generator", cost: 1000, cps: 20 },
  { id: "dominion", name: "Dominion Matrix", cost: 5000, cps: 100 },
];

const VoidClicker = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [quanta, setQuanta] = useState(() => {
    const saved = localStorage.getItem("void-quanta");
    return saved ? parseFloat(saved) : 0;
  });
  const [totalQuanta, setTotalQuanta] = useState(() => {
    const saved = localStorage.getItem("void-total");
    return saved ? parseFloat(saved) : 0;
  });
  const [upgrades, setUpgrades] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("void-upgrades");
    return saved ? JSON.parse(saved) : {};
  });
  const [ascensions, setAscensions] = useState(() => {
    const saved = localStorage.getItem("void-ascensions");
    return saved ? parseInt(saved) : 0;
  });
  const [clickPower, setClickPower] = useState(1);
  const [pulseScale, setPulseScale] = useState(1);

  const cps = UPGRADES.reduce((sum, u) => sum + (upgrades[u.id] || 0) * u.cps, 0) * (1 + ascensions * 0.5);

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  useEffect(() => {
    localStorage.setItem("void-quanta", quanta.toString());
    localStorage.setItem("void-total", totalQuanta.toString());
    localStorage.setItem("void-upgrades", JSON.stringify(upgrades));
    localStorage.setItem("void-ascensions", ascensions.toString());
  }, [quanta, totalQuanta, upgrades, ascensions]);

  useEffect(() => {
    if (ascensions >= 1 && !badges.includes("Ascension Crest")) {
      onEarnBadge("Ascension Crest");
      toast.success("🏆 Badge Earned: Ascension Crest!", {
        description: "You've transcended the material plane!",
      });
    }
  }, [ascensions, badges, onEarnBadge]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cps > 0) {
        setQuanta(q => q + cps / 10);
        setTotalQuanta(t => t + cps / 10);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cps]);

  const handleClick = () => {
    playSound('playClick');
    const gain = clickPower * (1 + ascensions * 0.5);
    setQuanta(q => q + gain);
    setTotalQuanta(t => t + gain);
    setPulseScale(1.2);
    setTimeout(() => setPulseScale(1), 100);
  };

  const buyUpgrade = (upgradeId: string, cost: number) => {
    if (quanta >= cost) {
      playSound('playPowerup');
      setQuanta(q => q - cost);
      setUpgrades(u => ({ ...u, [upgradeId]: (u[upgradeId] || 0) + 1 }));
    }
  };

  const getUpgradeCost = (base: number, owned: number) => {
    return Math.floor(base * Math.pow(1.15, owned));
  };

  const canAscend = totalQuanta >= 100000;

  const handleAscension = () => {
    if (canAscend) {
      playSound('playLevelUp');
      setAscensions(a => a + 1);
      setQuanta(0);
      setTotalQuanta(0);
      setUpgrades({});
      toast.success("✨ Ascension Complete!", {
        description: `You now have ${ascensions + 1}x permanent bonus!`,
      });
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return Math.floor(n).toString();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Void Clicker</h2>
          <p className="text-xs text-muted-foreground">Tap consciousness quanta</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">{formatNumber(quanta)}</p>
          <p className="text-xs text-muted-foreground">{cps.toFixed(1)} /sec</p>
        </div>
      </div>

      {ascensions > 0 && (
        <div className="text-center mb-4">
          <span className="text-sm text-purple-400">
            ✨ Ascension Level: {ascensions} (+{(ascensions * 50).toFixed(0)}% power)
          </span>
        </div>
      )}

      {/* Main clicker */}
      <div className="flex justify-center mb-6">
        <motion.button
          animate={{ scale: pulseScale }}
          onClick={handleClick}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/50 flex items-center justify-center group"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <span className="text-5xl md:text-6xl relative">✡</span>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
        </motion.button>
      </div>

      {/* Upgrades */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {UPGRADES.map(upgrade => {
          const owned = upgrades[upgrade.id] || 0;
          const cost = getUpgradeCost(upgrade.cost, owned);
          const canAfford = quanta >= cost;
          
          return (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade.id, cost)}
              disabled={!canAfford}
              className={`p-3 rounded-lg border transition-all text-left ${
                canAfford 
                  ? "bg-card/50 border-primary/30 hover:border-primary/50" 
                  : "bg-muted/30 border-border/30 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{upgrade.name}</span>
                <span className="text-xs text-accent">{owned}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatNumber(cost)} | +{upgrade.cps}/s
              </div>
            </button>
          );
        })}
      </div>

      {/* Ascension */}
      <button
        onClick={handleAscension}
        disabled={!canAscend}
        className={`w-full p-3 rounded-lg border transition-all ${
          canAscend
            ? "bg-purple-500/20 border-purple-500/50 hover:border-purple-500"
            : "bg-muted/20 border-border/30 opacity-50"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Ascend (100K total)</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Reset for permanent +50% multiplier
        </p>
      </button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Each tap generates consciousness quanta"
      </p>
    </div>
  );
};

export default VoidClicker;
