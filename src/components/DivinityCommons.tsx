import { motion } from "framer-motion";
import flowerOfLife from "@/assets/flower-of-life.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import torusField from "@/assets/torus-field.png";

const geometryData = [
  {
    image: flowerOfLife,
    title: "The Flower of Life",
    description: "The fundamental pattern of creation, found in ancient temples worldwide. Its 19 interlocking circles represent the interconnected nature of all existence.",
    frequency: "432 Hz - The Natural Frequency",
  },
  {
    image: metatronsCube,
    title: "Metatron's Cube",
    description: "Contains all Platonic Solids, the building blocks of physical reality. This sacred form represents the blueprint of creation itself.",
    frequency: "528 Hz - DNA Repair Frequency",
  },
  {
    image: torusField,
    title: "The Torus Field",
    description: "The self-sustaining energy pattern of the universe. Your heart generates a toroidal field that extends 8-10 feet beyond your body.",
    frequency: "639 Hz - Connecting Relationships",
  },
];

const DivinityCommons = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="divinity-commons">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

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
            The Math of God
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sacred geometry reveals the mathematical language underlying all creation. 
            These patterns resonate at specific frequencies that physically affect human DNA.
          </p>
        </motion.div>

        {/* Geometry Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {geometryData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="border-hermetic rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:shadow-sacred transition-all duration-500">
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-50" />
                </div>
                <h3 className="text-xl font-display text-foreground mb-2 group-hover:text-glow-cyan">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {item.frequency}
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
