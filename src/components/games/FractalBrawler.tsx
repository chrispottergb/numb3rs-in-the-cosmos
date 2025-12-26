import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Swords, Heart, Zap } from "lucide-react";
import { toast } from "sonner";

interface GameProps {
  onEarnBadge: (badge: string) => void;
  badges: string[];
}

const HEROES = [
  { id: "tetra", name: "Tetra", emoji: "🔺", attack: 15, defense: 10 },
  { id: "hexa", name: "Hexa", emoji: "⬡", attack: 12, defense: 15 },
  { id: "octa", name: "Octa", emoji: "◈", attack: 18, defense: 8 },
];

const ENEMIES = [
  { name: "Shadow Cube", emoji: "🔳", hp: 50, attack: 8 },
  { name: "Void Prism", emoji: "💠", hp: 80, attack: 12 },
  { name: "Chaos Sphere", emoji: "🔮", hp: 120, attack: 15 },
];

const FractalBrawler = ({ onEarnBadge, badges }: GameProps) => {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [heroHp, setHeroHp] = useState(100);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(ENEMIES[0].hp);
  const [isAttacking, setIsAttacking] = useState(false);
  const [winStreak, setWinStreak] = useState(() => {
    const saved = localStorage.getItem("brawler-streak");
    return saved ? parseInt(saved) : 0;
  });
  const [totalWins, setTotalWins] = useState(() => {
    const saved = localStorage.getItem("brawler-wins");
    return saved ? parseInt(saved) : 0;
  });
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const hero = HEROES.find(h => h.id === selectedHero);
  const enemy = ENEMIES[enemyIndex];

  useEffect(() => {
    localStorage.setItem("brawler-streak", winStreak.toString());
    localStorage.setItem("brawler-wins", totalWins.toString());
    
    if (winStreak >= 5 && !badges.includes("Unity Warrior")) {
      onEarnBadge("Unity Warrior");
      toast.success("🏆 Badge Earned: Unity Warrior!", {
        description: "5 consecutive victories! Unity is power!",
      });
    }
  }, [winStreak, totalWins, badges, onEarnBadge]);

  const attack = () => {
    if (!hero || isAttacking) return;
    setIsAttacking(true);

    const damage = Math.floor(hero.attack * (0.8 + Math.random() * 0.4));
    const newEnemyHp = Math.max(0, enemyHp - damage);
    
    setBattleLog(prev => [...prev.slice(-4), `${hero.name} deals ${damage} damage!`]);
    setEnemyHp(newEnemyHp);

    setTimeout(() => {
      if (newEnemyHp <= 0) {
        handleVictory();
      } else {
        enemyAttack();
      }
      setIsAttacking(false);
    }, 500);
  };

  const enemyAttack = () => {
    if (!hero) return;
    const damage = Math.max(1, Math.floor(enemy.attack * (0.8 + Math.random() * 0.4) - hero.defense / 2));
    const newHeroHp = Math.max(0, heroHp - damage);
    
    setBattleLog(prev => [...prev.slice(-4), `${enemy.name} deals ${damage} damage!`]);
    setHeroHp(newHeroHp);

    if (newHeroHp <= 0) {
      handleDefeat();
    }
  };

  const handleVictory = () => {
    setWinStreak(s => s + 1);
    setTotalWins(t => t + 1);
    setBattleLog(prev => [...prev.slice(-4), `✨ Victory! ${enemy.name} defeated!`]);
    
    toast.success("Victory!", { description: `You defeated the ${enemy.name}!` });

    setTimeout(() => {
      const nextEnemy = (enemyIndex + 1) % ENEMIES.length;
      setEnemyIndex(nextEnemy);
      setEnemyHp(ENEMIES[nextEnemy].hp);
      setHeroHp(100);
    }, 1000);
  };

  const handleDefeat = () => {
    setWinStreak(0);
    setBattleLog(prev => [...prev.slice(-4), `💀 Defeat... Your hero has fallen.`]);
    toast.error("Defeat!", { description: "Your consciousness must reawaken..." });
    
    setTimeout(() => {
      setSelectedHero(null);
      setEnemyIndex(0);
      setEnemyHp(ENEMIES[0].hp);
      setBattleLog([]);
    }, 1500);
  };

  const healAbility = () => {
    if (!hero) return;
    const heal = Math.floor(20 + Math.random() * 10);
    setHeroHp(hp => Math.min(100, hp + heal));
    setBattleLog(prev => [...prev.slice(-4), `💚 Healed for ${heal} HP!`]);
  };

  if (!selectedHero) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-display text-gradient-sacred mb-2">Fractal Brawler</h2>
          <p className="text-sm text-muted-foreground">Choose your platonic warrior</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {HEROES.map(h => (
            <motion.button
              key={h.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedHero(h.id);
                setHeroHp(100);
              }}
              className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all"
            >
              <span className="text-4xl block mb-2">{h.emoji}</span>
              <p className="font-medium">{h.name}</p>
              <p className="text-xs text-muted-foreground">ATK: {h.attack} | DEF: {h.defense}</p>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-accent">
            🏆 Win Streak: {winStreak} | Total Wins: {totalWins}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display text-gradient-sacred">Fractal Brawler</h2>
        <div className="text-right">
          <p className="text-sm text-accent">Streak: {winStreak}</p>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="flex justify-between items-center mb-6 px-4">
        {/* Hero */}
        <motion.div
          animate={{ x: isAttacking ? 30 : 0 }}
          className="text-center"
        >
          <span className="text-5xl block mb-2">{hero?.emoji}</span>
          <p className="font-medium text-sm">{hero?.name}</p>
          <div className="w-20 h-2 bg-muted rounded-full mt-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${heroHp}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{heroHp}/100</p>
        </motion.div>

        <Swords className="w-8 h-8 text-accent animate-pulse" />

        {/* Enemy */}
        <motion.div
          animate={{ x: isAttacking ? 0 : 0 }}
          className="text-center"
        >
          <span className="text-5xl block mb-2">{enemy.emoji}</span>
          <p className="font-medium text-sm">{enemy.name}</p>
          <div className="w-20 h-2 bg-muted rounded-full mt-2">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${(enemyHp / enemy.hp) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{enemyHp}/{enemy.hp}</p>
        </motion.div>
      </div>

      {/* Battle Log */}
      <div className="bg-muted/30 rounded-lg p-3 mb-4 h-24 overflow-y-auto">
        {battleLog.map((log, i) => (
          <p key={i} className="text-xs text-muted-foreground">{log}</p>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={attack}
          disabled={isAttacking}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          Attack
        </button>
        <button
          onClick={healAbility}
          disabled={isAttacking}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/50 hover:bg-green-500/30 transition-all disabled:opacity-50"
        >
          <Heart className="w-4 h-4" />
          Heal
        </button>
      </div>

      <button
        onClick={() => setSelectedHero(null)}
        className="w-full mt-4 p-2 text-sm text-muted-foreground hover:text-primary"
      >
        ← Choose different hero
      </button>
    </div>
  );
};

export default FractalBrawler;
