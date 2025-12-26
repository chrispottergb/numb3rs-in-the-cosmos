import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Resonance Room", href: "#resonance-room" },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/science"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide"
          >
            The Science
          </Link>
          <Link
            to="/merch"
            className="relative text-sm font-medium tracking-wide px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:border-primary transition-all duration-300 animate-pulse"
          >
            <span className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
            <span className="relative">🛒 Merch</span>
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

        {/* Mobile menu drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-xl border-border/50">
            <div className="flex flex-col gap-6 pt-8">
              {/* Highlighted Merch Button */}
              <SheetClose asChild>
                <Link
                  to="/merch"
                  className="relative text-lg font-medium tracking-wide px-6 py-3 rounded-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:border-primary transition-all duration-300 animate-pulse text-center"
                >
                  <span className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
                  <span className="relative">🛒 Merch</span>
                </Link>
              </SheetClose>

              {/* Other Links */}
              <SheetClose asChild>
                <Link
                  to="/science"
                  className="text-lg text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
                >
                  The Science
                </Link>
              </SheetClose>

              {navLinks.map((link) => (
                <SheetClose asChild key={link.name}>
                  <a
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
                  >
                    {link.name}
                  </a>
                </SheetClose>
              ))}

              {/* Home Link */}
              <SheetClose asChild>
                <Link
                  to="/home"
                  className="text-lg text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
                >
                  Home
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
};

export default Navigation;
