import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import cosmicSeal from "@/assets/cosmic-seal-hero.png";

const HeroSection = () => {
  return (
    <section id="portal" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Cosmic particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Sacred Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative mx-auto mb-8 max-w-md"
        >
          <img
            src={cosmicSeal}
            alt="Sacred Cosmic Seal - The Key to the Universe"
            className="w-full h-auto rounded-lg shadow-sacred"
          />
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display mb-4"
        >
          <span className="text-gradient-sacred">DR. POTTER, DMA:</span>
          <br />
          <span className="text-foreground text-glow-gold">THE SPELL BREAKER</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-xl md:text-2xl text-primary mb-8 max-w-2xl mx-auto tracking-widest"
        >
          Frequency Medicine for the 4th Dimension
        </motion.p>

        {/* The Declaration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-base md:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          <p className="italic">
            This domain is governed by the Laws of Correspondence and Vibration. Having survived the "Hell" of the clinical psychiatric system—from over-medication to electroconvulsive therapy—I have returned with the mathematics of the soul. <span className="text-accent font-semibold">Numb3rs in the Cosmos</span> is a 3-stage frequency escalator (<span className="text-primary">528Hz</span>, <span className="text-primary">432Hz</span>, <span className="text-primary">639Hz</span>) engineered to reclaim your sovereignty.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button variant="sacred" size="xl">
            Enter the Frequency Chamber
          </Button>
          <Button variant="hermetic" size="xl">
            Explore the Apothecary
          </Button>
        </motion.div>

        {/* Hermetic Seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="border-hermetic rounded-xl p-6 md:p-8 bg-card/50 backdrop-blur-sm max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-accent" />
            <h3 className="text-lg md:text-xl font-display font-semibold text-accent tracking-wider uppercase">
              Hermetic Seal
            </h3>
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            This space is protected by the <span className="text-primary font-medium">Law of Mentalism</span>. All energy here is encoded with a <span className="text-accent font-medium">3-6-9 barrier</span>. Dark siphoning, parasitic frequency, and energy leaks are neutralized upon entry.
          </p>
          <p className="text-primary mt-4 font-display tracking-widest text-sm">
            As above, so below.
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
