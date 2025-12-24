import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag } from "lucide-react";

interface ApparelProduct {
  id: number;
  name: string;
  description: string;
  frequency: string;
  image: string;
  price: string;
  sizes: string[];
}

interface ApparelProductCardProps {
  item: ApparelProduct;
  index: number;
}

const ApparelProductCard = ({ item, index }: ApparelProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group border-hermetic rounded-xl p-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
    >
      <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-base font-display text-foreground mb-2 text-center">
        {item.name}
      </h4>
      <p className="text-muted-foreground text-xs mb-3 text-center">
        {item.description}
      </p>
      <span className="block text-xs font-medium tracking-wider text-primary text-center mb-3">
        {item.frequency}
      </span>

      {/* Price */}
      <div className="text-center mb-3">
        <span className="text-xl font-display text-accent text-glow-gold">
          {item.price}
        </span>
      </div>

      {/* Size Selection */}
      <Select value={selectedSize} onValueChange={setSelectedSize}>
        <SelectTrigger className="w-full mb-3 bg-background/50 border-border/50">
          <SelectValue placeholder="Select Size" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {item.sizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="hermetic"
        size="sm"
        className="w-full"
        disabled={!selectedSize}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </motion.div>
  );
};

export default ApparelProductCard;
