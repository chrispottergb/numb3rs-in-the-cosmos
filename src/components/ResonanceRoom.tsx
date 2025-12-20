import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, Sparkles, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Protected Space",
    description: "Hermetically sealed against energy siphoning. Only high-vibration souls enter.",
  },
  {
    icon: Users,
    title: "Spell Breakers United",
    description: "Connect with awakened individuals breaking free from the matrix.",
  },
  {
    icon: Sparkles,
    title: "Sacred Knowledge",
    description: "Access exclusive teachings on frequency healing and divine mathematics.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Resonance",
    description: "Engage in live discussions during frequency meditation sessions.",
  },
];

const ResonanceRoom = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="resonance-room">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 border border-primary/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-48 h-48 border border-accent/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display text-gradient-sacred mb-4">
            The Resonance Room
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A sacred gathering space for the awakened. Join our protected community 
            of Spell Breakers where we share knowledge, heal together, and raise 
            collective vibration.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 border-hermetic rounded-lg bg-card/30 backdrop-blur-sm hover:shadow-cyan transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Discord CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="border-hermetic rounded-2xl bg-card/50 backdrop-blur-sm p-8 md:p-12 shadow-sacred">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
              <svg 
                className="w-10 h-10 text-background" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-display text-foreground mb-4">
              Join the Spell Breakers
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Enter our protected Discord sanctuary. Connect with fellow awakened souls, 
              participate in group frequency sessions, and access exclusive sacred teachings.
            </p>
            <Button variant="sacred" size="xl" className="w-full sm:w-auto">
              Enter the Resonance Room
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResonanceRoom;
