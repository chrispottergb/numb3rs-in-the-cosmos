import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import hoodieBlack from "@/assets/hoodie-black.jpeg";
import jacketRed from "@/assets/jacket-red.jpeg";
import beanieOrange from "@/assets/beanie-orange.jpeg";
import hoodieOrange from "@/assets/hoodie-orange.jpeg";

const merchItems = [
  { image: hoodieBlack, name: "Protection Hoodie", price: "$89" },
  { image: jacketRed, name: "Sacred Jacket", price: "$129" },
  { image: beanieOrange, name: "Frequency Beanie", price: "$39" },
  { image: hoodieOrange, name: "Cosmic Hoodie", price: "$89" },
];

const MerchPreview = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sacred Attire
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Wear your frequency. Each piece is infused with sacred geometry and protective energies.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {merchItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-foreground font-semibold text-sm md:text-base">{item.name}</h3>
                <p className="text-primary font-bold">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/merch">
            <Button size="lg" className="group">
              Browse All Merch
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MerchPreview;
