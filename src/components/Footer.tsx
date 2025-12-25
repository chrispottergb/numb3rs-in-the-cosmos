import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-background pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center">

          {/* Sacred geometry divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-3 h-3 rotate-45 border border-accent/50" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>

          {/* Emerald Tablet quote */}
          <blockquote className="text-sm text-muted-foreground italic max-w-md mx-auto mb-8">
            "That which is Below corresponds to that which is Above, and that 
            which is Above corresponds to that which is Below, to accomplish 
            the miracle of the One Thing."
          </blockquote>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Numb3rs in the Cosmos. All vibrations reserved.
          </p>
          <p className="text-xs text-primary/40 mt-2">
            3 · 6 · 9
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
