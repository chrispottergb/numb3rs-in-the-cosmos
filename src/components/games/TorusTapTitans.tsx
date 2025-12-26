import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Swords, Users } from "lucide-react";
import { toast } from "sonner";

interface GameSounds {
  playClick: () => void;
  playHit: () => void;
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

const HEROES = [
  { id: "michael", name: "Michael", emoji: "⚔️", dps: 5, cost: 100 },
  { id: "gabriel", name: "Gabriel", emoji: "🎺", dps: 15, cost: 500 },
  { id: "raphael", name: "Raphael", emoji: "💚", dps: 50, cost: 2000 },
  { id: "uriel", name: "Uriel", emoji: "🔥", dps: 200, cost: 10000 },
];

const BOSSES = [
  { name: "Shadow Wisp", emoji: "👻", hp: 100 },
  { name: "Void Walker", emoji: "🌑", hp: 500 },
  { name: "Chaos Drake", emoji: "🐉", hp: 2000 },
  { name: "Entropy Lord", emoji: "💀", hp: 10000 },
  { name: "Oblivion King", emoji: "👑", hp: 50000 },
];

const TorusTapTitans = ({ onEarnBadge, badges, soundEnabled = true, gameSounds }: GameProps) => {
  const [gold, setGold] = useState(() => {
    const saved = localStorage.getItem("torus-gold");
    return saved ? parseFloat(saved) : 0;
  });
  const [bossIndex, setBossIndex] = useState(() => {
    const saved = localStorage.getItem("torus-boss");
    return saved ? parseInt(saved) : 0;
  });
  const [bossHp, setBossHp] = useState(() => {
    const saved = localStorage.getItem("torus-bosshp");
    return saved ? parseFloat(saved) : BOSSES[0].hp;
  });
  const [heroes, setHeroes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("torus-heroes");
    return saved ? JSON.parse(saved) : {};
  });
  const [tapDamage, setTapDamage] = useState(1);
  const [bossesDefeated, setBossesDefeated] = useState(() => {
    const saved = localStorage.getItem("torus-defeated");
    return saved ? parseInt(saved) : 0;
  });

  const dps = HEROES.reduce((sum, h) => sum + (heroes[h.id] || 0) * h.dps, 0);
  const boss = BOSSES[bossIndex % BOSSES.length];

  const playSound = useCallback((sound: keyof GameSounds) => {
    if (soundEnabled && gameSounds && gameSounds[sound]) {
      gameSounds[sound]();
    }
  }, [soundEnabled, gameSounds]);

  useEffect(() => {
    localStorage.setItem("torus-gold", gold.toString());
    localStorage.setItem("torus-boss", bossIndex.toString());
    localStorage.setItem("torus-bosshp", bossHp.toString());
    localStorage.setItem("torus-heroes", JSON.stringify(heroes));
    localStorage.setItem("torus-defeated", bossesDefeated.toString());
  }, [gold, bossIndex, bossHp, heroes, bossesDefeated]);

  useEffect(() => {
    if (bossesDefeated >= 50 && !badges.includes("Eternal Flame")) {
      onEarnBadge("Eternal Flame");
      toast.success("🏆 Badge Earned: Eternal Flame!", {
        description: "50 bosses banished to the void!",
      });
    }
  }, [bossesDefeated, badges, onEarnBadge]);

  // Idle DPS
  useEffect(() => {
    const interval = setInterval(() => {
      if (dps > 0) {
        setBossHp(hp => {
          const newHp = hp - dps / 10;
          if (newHp <= 0) {
            handleBossDefeat();
            return boss.hp;
          }
          return newHp;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [dps, boss.hp]);

  const handleTap = () => {
    playSound('playHit');
    setBossHp(hp => {
      const newHp = hp - tapDamage;
      if (newHp <= 0) {
        handleBossDefeat();
        return boss.hp;
      }
      return newHp;
    });
  };

  const handleBossDefeat = () => {
    playSound('playLevelUp');
    const reward = Math.floor(boss.hp * 0.5);
    setGold(g => g + reward);
    setBossIndex(i => i + 1);
    setBossesDefeated(d => d + 1);
    setBossHp(BOSSES[(bossIndex + 1) % BOSSES.length].hp);
    toast.success(`${boss.name} defeated!`, { description: `+${reward} gold` });
  };

  const buyHero = (heroId: string, cost: number) => {
    if (gold >= cost) {
      playSound('playPowerup');
      setGold(g => g - cost);
      setHeroes(h => ({ ...h, [heroId]: (h[heroId] || 0) + 1 }));
    }
  };

  const getHeroCost = (base: number, owned: number) => {
    return Math.floor(base * Math.pow(1.1, owned));
  };

  const formatNumber = (n: number) => {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return Math.floor(n).toString();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-gradient-sacred">Torus Tap Titans</h2>
          <p className="text-xs text-muted-foreground">Defeat shadow entities</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-accent">🪙 {formatNumber(gold)}</p>
          <p className="text-xs text-muted-foreground">{formatNumber(dps)} DPS</p>
        </div>
      </div>

      <div className="text-center mb-4">
        <span className="text-sm text-purple-400">
          Bosses Defeated: {bossesDefeated}/50
          {bossesDefeated >= 50 && <Sparkles className="inline w-4 h-4 ml-1" />}
        </span>
      </div>

      {/* Boss */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">Stage {bossIndex + 1}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTap}
          className="relative inline-block"
        >
          <span className="text-7xl block">{boss.emoji}</span>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-accent text-lg font-bold">-{tapDamage}</span>
          </motion.div>
        </motion.button>
        <p className="font-medium mt-2">{boss.name}</p>
        <div className="w-48 mx-auto h-3 bg-muted rounded-full mt-2">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
            style={{ width: `${(bossHp / boss.hp) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatNumber(bossHp)} / {formatNumber(boss.hp)}
        </p>
      </div>

      {/* Heroes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Archangel Heroes</span>
        </div>
        {HEROES.map(hero => {
          const owned = heroes[hero.id] || 0;
          const cost = getHeroCost(hero.cost, owned);
          const canAfford = gold >= cost;
          
          return (
            <button
              key={hero.id}
              onClick={() => buyHero(hero.id, cost)}
              disabled={!canAfford}
              className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                canAfford 
                  ? "bg-card/50 border-primary/30 hover:border-primary/50" 
                  : "bg-muted/30 border-border/30 opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{hero.emoji}</span>
                <div className="text-left">
                  <p className="text-sm font-medium">{hero.name}</p>
                  <p className="text-xs text-muted-foreground">+{hero.dps} DPS each</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-accent">{owned}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(cost)} 🪙</p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        "Tap to unleash torus energy upon the shadows"
      </p>
    </div>
  );
};

export default TorusTapTitans;
