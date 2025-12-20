import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const products = [
  {
    category: "LOSSLESS VINYL",
    name: "Infinity Sign",
    description: "180g heavy-weight pressing, 432Hz mastered",
    price: "$49.99",
    crystal: "Lapis Lazuli",
    image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400&h=400&fit=crop",
  },
  {
    category: "LOSSLESS VINYL",
    name: "Cosmic Resonance",
    description: "Limited edition holographic sleeve, 528Hz",
    price: "$59.99",
    crystal: "Amethyst",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
  },
  {
    category: "FREQUENCY ROCKS",
    name: "Lapis Lazuli Cluster",
    description: "Charged with Infinity Sign frequencies",
    price: "$89.99",
    frequency: "432 Hz",
    image: "https://images.unsplash.com/photo-1610482899309-9b49afb4e695?w=400&h=400&fit=crop",
  },
  {
    category: "FREQUENCY ROCKS",
    name: "Amethyst Crown",
    description: "Third eye activation, dream enhancement",
    price: "$129.99",
    frequency: "852 Hz",
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&h=400&fit=crop",
  },
  {
    category: "FREQUENCY ROCKS",
    name: "Clear Quartz Tower",
    description: "Master healer, amplifies all frequencies",
    price: "$149.99",
    frequency: "963 Hz",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop",
  },
  {
    category: "LOSSLESS VINYL",
    name: "Divine Geometry",
    description: "Triple gatefold, sacred geometry artwork",
    price: "$79.99",
    crystal: "Rose Quartz",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop",
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
            Sacred artifacts imbued with healing frequencies. Each item is 
            ceremonially charged and tuned to specific vibrational patterns.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="border-hermetic rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm hover:shadow-sacred transition-all duration-500">
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-square">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-secondary/80 backdrop-blur-sm rounded-full text-xs font-medium text-secondary-foreground tracking-wider">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    {product.crystal && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        {product.crystal}
                      </span>
                    )}
                    {product.frequency && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {product.frequency}
                      </span>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display text-accent text-glow-gold">
                      {product.price}
                    </span>
                    <Button variant="outline" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApothecarySection;
