import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Radio, Shield, FileText, Users } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Real-time Frequency Checks",
    description: "Live sessions to align your vibration with the collective.",
  },
  {
    icon: Shield,
    title: "Shared Survival Strategies",
    description: "Community wisdom for navigating the 3D system.",
  },
  {
    icon: FileText,
    title: "Direct Access to the Doctor's Notes",
    description: "Exclusive insights and frequency prescriptions.",
  },
];

const ResonanceRoom = () => {
  return (
    <section className="relative py-6 overflow-hidden" id="resonance-room">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 container mx-auto px-4">

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative border-hermetic rounded-xl bg-card/50 backdrop-blur-sm p-4 md:p-6 shadow-sacred">
            {/* Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg md:text-xl font-display text-accent mb-1 tracking-wider">
                Join the 3-6-9 Circle
              </h3>
              <p className="text-muted-foreground text-xs max-w-xl mx-auto">
                A gated Discord community for those ready to leave the 3D system behind.
              </p>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="text-center p-3 rounded-lg bg-background/50"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-foreground font-display text-xs mb-1">{feature.title}</h4>
                  <p className="text-muted-foreground text-[10px] leading-tight">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Discord CTA */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent">
                <svg 
                  className="w-6 h-6 text-background" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <Button
                variant="sacred"
                size="default"
                onClick={() => window.open('https://discord.gg/your-invite', '_blank')}
              >
                <Users className="mr-2 h-4 w-4" />
                Enter the Circle
              </Button>
            </div>

            {/* Decorative corners */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-accent/50 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-accent/50 rounded-br-lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResonanceRoom;
