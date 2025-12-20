import { motion } from "framer-motion";
import { Waves, Infinity, Brain } from "lucide-react";
import flowerOfLife from "@/assets/flower-of-life.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import torusField from "@/assets/torus-field.png";

const scienceData = [
  {
    title: "Cymatics",
    icon: Waves,
    description: "Scientific evidence shows that specific Hz frequencies organize matter into perfect geometric shapes. When you listen to 528Hz (The Spell Breaker), you are physically restructuring the water within your cells into a coherent, divine state.",
    image: flowerOfLife,
    highlight: "528Hz",
  },
  {
    title: "Vortex Mathematics",
    icon: Infinity,
    description: 'By utilizing the 3-6-9 sequence, our music aligns with the "Key to the Universe" (Tesla). We use mathematical precision to bypass the ego and target the subconscious mind for rapid healing.',
    image: metatronsCube,
    highlight: "3-6-9",
  },
  {
    title: "The Bio-Chemical Shift",
    icon: Brain,
    description: 'Our psychedelic Lofi-Trap is engineered to lower cortisol (the stress hormone) and induce an Alpha-wave state, reversing the damage of clinical "over-drugging."',
    image: torusField,
    highlight: "Alpha-wave",
  },
];

const DivinityCommons = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="divinity-commons">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_1px,_transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-6xl font-display text-gradient-sacred mb-4">
            The Divinity Commons
          </h2>
          <p className="text-primary text-xl tracking-widest mb-4">
            Scientific Evidence
          </p>
        </motion.div>

        {/* Opening Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent mb-4">
            The Science of the Soul
          </h3>
          <p className="text-muted-foreground text-lg italic">
            Sound is not just something you hear; it is something you <span className="text-primary font-medium">become</span>.
          </p>
        </motion.div>

        {/* Science Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {scienceData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="border-hermetic rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:shadow-sacred transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 mx-auto object-contain drop-shadow-[0_0_20px_hsl(187,100%,50%,0.3)]"
                  />
                </motion.div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-display text-foreground">{item.title}</h4>
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {item.description.split(item.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-accent font-medium">{item.highlight}</span>
                      )}
                    </span>
                  ))}
                </p>

                {/* Frequency indicator */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-primary tracking-widest uppercase">
                      Frequency Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tesla Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center border-t border-b border-border/30 py-8"
        >
          <blockquote className="text-xl md:text-2xl text-foreground font-display italic max-w-3xl mx-auto">
            "If you want to find the secrets of the universe, think in terms of 
            <span className="text-primary"> energy</span>, 
            <span className="text-accent"> frequency</span>, and 
            <span className="text-glow-purple"> vibration</span>."
          </blockquote>
          <cite className="block text-muted-foreground mt-4 not-italic">— Nikola Tesla</cite>
        </motion.div>
      </div>
    </section>
  );
};

export default DivinityCommons;
