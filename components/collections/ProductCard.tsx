"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Layers } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  thickness_options: string[];
  image_urls: string[];
  stock_status: "in_stock" | "limited" | "sold_out";
  category_name?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stockConfig = {
    in_stock: { text: "In Stock", class: "bg-emerald-950/80 text-emerald-400 border-emerald-500/20" },
    limited: { text: "Limited Slabs", class: "bg-amber-950/80 text-amber-400 border-amber-500/20" },
    sold_out: { text: "Sold Out", class: "bg-rose-950/80 text-rose-400 border-rose-500/20" },
  };

  const status = stockConfig[product.stock_status] || stockConfig.in_stock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-brand-charcoal relative overflow-hidden group border border-brand-gold/10 hover:border-brand-gold/45 transition-colors duration-500 flex flex-col h-full"
    >
      {/* Slab Image Section */}
      <div className="aspect-[3/4] w-full relative overflow-hidden">
        {/* 
          Using motion.img with a layoutId enables the beautiful 
          shared-element expansion transition to the details hero page.
        */}
        <motion.img
          layoutId={`product-img-${product.slug}`}
          src={product.image_urls[0] || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top left Category Tag */}
        <div className="absolute top-4 left-4 z-20 bg-brand-charcoal/80 backdrop-blur-md px-3 py-1 border border-brand-gold/20 text-[9px] uppercase tracking-widest text-brand-gold">
          {product.category_name || "Exotic Slab"}
        </div>

        {/* Top right Stock Status Badge */}
        <div className={`absolute top-4 right-4 z-20 backdrop-blur-md px-3 py-1 border text-[9px] uppercase tracking-widest ${status.class}`}>
          {status.text}
        </div>

        {/* Hover overlay borders */}
        <div className="absolute inset-0 border-[0px] group-hover:border-2 border-brand-gold/55 z-30 transition-all duration-350 pointer-events-none" />

        {/* Sliding Card details (Ace Marbles inspired overlay) */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/90 to-brand-charcoal/30 flex flex-col justify-end p-6 z-20 translate-y-[62%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
          
          {/* Default Header */}
          <div className="mb-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-lg sm:text-xl text-brand-ivory mb-1 tracking-wide font-medium">
              {product.name}
            </h3>
            <p className="text-[10px] text-brand-gold font-sans uppercase tracking-[0.15em]">
              {product.colour} • {product.finish}
            </p>
          </div>

          {/* Expanded Details */}
          <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <div className="h-[1px] w-full bg-brand-gold/20" />
            
            <div className="flex items-center gap-2 text-[11px] text-brand-ivory/80">
              <Layers className="h-3.5 w-3.5 text-brand-gold shrink-0" />
              <span>Thickness: {product.thickness_options.join(", ")}</span>
            </div>

            <Link
              href={`/collections/${product.slug}`}
              className="w-full py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
