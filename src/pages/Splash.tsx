import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Splash = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle cosmic particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-24 left-8 right-8 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent"
      />

      {/* Quote content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center max-w-4xl relative z-10"
      >
        <p className="text-2xl md:text-4xl lg:text-5xl font-display italic leading-relaxed text-foreground">
          <span className="text-muted-foreground">&ldquo;</span>
          If you want to find the secrets of the universe, think in terms of{" "}
          <span className="text-[hsl(185,100%,50%)] not-italic font-semibold">ENERGY</span>
          <span className="text-muted-foreground">,</span>{" "}
          <span className="text-accent not-italic font-semibold">FREQUENCY</span>
          <span className="text-muted-foreground">,</span> and{" "}
          <span className="text-primary not-italic font-semibold">VIBRATION</span>
          <span className="text-muted-foreground">.&rdquo;</span>
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 text-xl md:text-2xl text-muted-foreground font-display tracking-wide"
        >
          — Nikola Tesla
        </motion.p>
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        className="absolute bottom-40 left-8 right-8 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent"
      />

      {/* Enter button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="mt-16 relative z-10"
      >
        <Button
          onClick={handleEnter}
          variant="sacred"
          size="xl"
          className="tracking-widest uppercase"
        >
          Enter the 4th Dimension
        </Button>
      </motion.div>
    </div>
  );
};

export default Splash;
