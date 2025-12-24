import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Resonance Room", href: "#resonance-room" },
];

const Navigation = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/home" 
          className="text-xl font-display text-gradient-sacred hover:text-glow-cyan transition-all"
        >
          N3C
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/science"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide"
          >
            The Science
          </Link>
          <Link
            to="/merch"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide"
          >
            Merch
          </Link>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile menu indicator */}
        <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </motion.header>
  );
};

export default Navigation;
