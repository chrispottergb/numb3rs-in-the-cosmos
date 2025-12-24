import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Disc, ShoppingBag } from "lucide-react";
import lapisLazuliImg from "@/assets/lapis-lazuli-crystal.png";
import seleniteImg from "@/assets/selenite-crystal.png";
import blackTourmalineImg from "@/assets/black-tourmaline-crystal.png";
// Apparel images
import hoodieBlackImg from "@/assets/hoodie-black.jpeg";
import hoodieNavyImg from "@/assets/hoodie-navy.jpeg";
import hoodieOrangeImg from "@/assets/hoodie-orange.jpeg";
import hoodieGrayImg from "@/assets/hoodie-gray.jpeg";
import jacketBlackImg from "@/assets/jacket-black.jpeg";
import jacketNavyImg from "@/assets/jacket-navy.jpeg";
import jacketRedImg from "@/assets/jacket-red.jpeg";
import beanieOrangeImg from "@/assets/beanie-orange.jpeg";
import beanieWhiteImg from "@/assets/beanie-white.jpeg";

const losslessArchive = [
  {
    id: 1,
    name: "The Trinity Digital Bundle",
    description: "24-bit High-Fidelity WAV files. Uncompressed for biological efficacy.",
    frequency: "528Hz • 432Hz • 639Hz",
    icon: Download,
    price: "$33.33",
  },
  {
    id: 2,
    name: "180g Infinity Vinyl",
    description: 'The physical weight of frequency. Includes a limited-edition "Vortex Math" lyric insert.',
    frequency: "Analog Warmth",
    icon: Disc,
    price: "$66.66",
  },
];

const crystals = [
  {
    id: 3,
    name: "Lapis Lazuli",
    description: "Charged at 528Hz during the Numb3rs master sessions. Enhances truth and inner wisdom.",
    frequency: "528Hz Charged",
    image: lapisLazuliImg,
  },
  {
    id: 4,
    name: "Selenite",
    description: "Charged at 528Hz during the Numb3rs master sessions. Clears energy blockages and amplifies frequency.",
    frequency: "528Hz Charged",
    image: seleniteImg,
  },
  {
    id: 5,
    name: "Black Tourmaline",
    description: "Charged at 528Hz during the Numb3rs master sessions. Protection against negative frequencies.",
    frequency: "528Hz Charged",
    image: blackTourmalineImg,
  },
];

const hoodies = [
  {
    id: 6,
    name: "Caduceus Hoodie - Black",
    description: "Premium hoodie featuring the Staff of Hermes with serpent wisdom and sacred geometry sleeve art.",
    frequency: "Sacred Protection",
    image: hoodieBlackImg,
  },
  {
    id: 7,
    name: "Caduceus Hoodie - Navy",
    description: "Premium hoodie featuring the Staff of Hermes with golden serpent design and hermetic symbols.",
    frequency: "Sacred Protection",
    image: hoodieNavyImg,
  },
  {
    id: 8,
    name: "Caduceus Hoodie - Orange",
    description: "Premium hoodie featuring the Staff of Hermes with detailed alchemical annotations.",
    frequency: "Sacred Protection",
    image: hoodieOrangeImg,
  },
  {
    id: 9,
    name: "Caduceus Hoodie - Gray",
    description: "Premium hoodie featuring the Staff of Hermes with subtle protective sigil artwork.",
    frequency: "Sacred Protection",
    image: hoodieGrayImg,
  },
];

const jackets = [
  {
    id: 10,
    name: "Guardian Jacket - Black",
    description: "Insulated winter jacket with full caduceus embroidery and hermetic sleeve symbols.",
    frequency: "Sacred Protection",
    image: jacketBlackImg,
  },
  {
    id: 11,
    name: "Guardian Jacket - Navy",
    description: "Insulated winter jacket with orange-gold caduceus design and sacred geometry accents.",
    frequency: "Sacred Protection",
    image: jacketNavyImg,
  },
  {
    id: 12,
    name: "Guardian Jacket - Crimson",
    description: "Insulated winter jacket with silver-white caduceus embroidery and alchemical symbols.",
    frequency: "Sacred Protection",
    image: jacketRedImg,
  },
];

const beanies = [
  {
    id: 13,
    name: "Sigil Beanie - Orange",
    description: "Protective beanie with embroidered triangle sigil and concentric circle design.",
    frequency: "Crown Chakra Shield",
    image: beanieOrangeImg,
  },
  {
    id: 14,
    name: "Sigil Beanie - White",
    description: "Protective beanie with embroidered triangle sigil and concentric circle design.",
    frequency: "Crown Chakra Shield",
    image: beanieWhiteImg,
  },
];

const ApothecarySection = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="apothecary">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />

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
            The Apothecary
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Merch & Media engineered for frequency healing
          </p>
        </motion.div>

        {/* The Lossless Archive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent text-center mb-10 tracking-wider">
            The Lossless Archive
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {losslessArchive.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group border-hermetic rounded-xl p-8 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-foreground mb-2">{item.name}</h4>
                    <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                    <span className="text-primary text-xs font-medium tracking-wider">{item.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <span className="text-2xl font-display text-accent text-glow-gold">{item.price}</span>
                  <Button variant="gold" size="sm">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charged Crystals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent text-center mb-10 tracking-wider">
            Charged Crystals
          </h3>
          
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {crystals.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group border-hermetic rounded-xl p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-display text-foreground mb-2">{item.name}</h4>
                <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                <span className="text-xs font-medium tracking-wider text-primary">
                  {item.frequency}
                </span>
                <Button variant="hermetic" size="sm" className="w-full mt-4">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Select
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Protection Hoodies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent text-center mb-10 tracking-wider">
            Caduceus Hoodies
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {hoodies.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group border-hermetic rounded-xl p-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center"
              >
                <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-base font-display text-foreground mb-2">{item.name}</h4>
                <p className="text-muted-foreground text-xs mb-3">{item.description}</p>
                <span className="text-xs font-medium tracking-wider text-accent">
                  {item.frequency}
                </span>
                <Button variant="hermetic" size="sm" className="w-full mt-4">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Select
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guardian Jackets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent text-center mb-10 tracking-wider">
            Guardian Jackets
          </h3>
          
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {jackets.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group border-hermetic rounded-xl p-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center"
              >
                <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-base font-display text-foreground mb-2">{item.name}</h4>
                <p className="text-muted-foreground text-xs mb-3">{item.description}</p>
                <span className="text-xs font-medium tracking-wider text-accent">
                  {item.frequency}
                </span>
                <Button variant="hermetic" size="sm" className="w-full mt-4">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Select
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sigil Beanies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-display text-accent text-center mb-10 tracking-wider">
            Sigil Beanies
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {beanies.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group border-hermetic rounded-xl p-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center"
              >
                <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-base font-display text-foreground mb-2">{item.name}</h4>
                <p className="text-muted-foreground text-xs mb-3">{item.description}</p>
                <span className="text-xs font-medium tracking-wider text-accent">
                  {item.frequency}
                </span>
                <Button variant="hermetic" size="sm" className="w-full mt-4">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Select
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApothecarySection;
