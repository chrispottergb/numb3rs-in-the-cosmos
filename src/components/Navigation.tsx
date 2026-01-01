import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Gamepad2, LogIn, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Resonance Room", href: "#resonance-room" },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/home');
    }
  };

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
        <div className="hidden md:flex items-center gap-6">
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
          <Link
            to="/games"
            className="relative text-sm font-medium tracking-wide px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30 hover:border-accent transition-all duration-300"
          >
            <span className="absolute inset-0 rounded-full bg-accent/20 blur-md" />
            <span className="relative flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              GAMES
            </span>
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

          {/* Auth Section */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                      Admin
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </>
          )}
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
              {/* Auth Section Mobile */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex flex-col gap-2 pb-4 border-b border-border/30">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="text-sm truncate">{user.email}</span>
                      </div>
                      {isAdmin && (
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full w-fit">
                          Admin
                        </span>
                      )}
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSignOut}
                          className="justify-start px-0 text-muted-foreground hover:text-foreground"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex items-center gap-2 text-lg text-primary font-medium py-2"
                      >
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </>
              )}

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

              {/* GAMES Button */}
              <SheetClose asChild>
                <Link
                  to="/games"
                  className="relative text-lg font-medium tracking-wide px-6 py-3 rounded-full bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30 hover:border-accent transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 rounded-full bg-accent/20 blur-md" />
                  <Gamepad2 className="w-5 h-5 relative" />
                  <span className="relative">GAMES</span>
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
