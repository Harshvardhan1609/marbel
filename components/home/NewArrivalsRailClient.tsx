"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Layers } from "lucide-react";

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

interface NewArrivalsRailClientProps {
  products: Product[];
}

export default function NewArrivalsRailClient({ products }: NewArrivalsRailClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollOffset = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollOffset : scrollLeft + scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-brand-ivory text-brand-charcoal overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Premium Additions
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-brand-charcoal">
            New Slab Arrivals
          </h2>
        </div>

        {/* Scroll Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 border border-brand-charcoal/10 hover:border-brand-gold text-brand-charcoal hover:text-brand-gold flex items-center justify-center transition-colors duration-300 rounded-none focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 border border-brand-charcoal/10 hover:border-brand-gold text-brand-charcoal hover:text-brand-gold flex items-center justify-center transition-colors duration-300 rounded-none focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Rail */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 -mx-6 px-6 md:-mx-12 md:px-12"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[350px] shrink-0 snap-start bg-brand-charcoal relative overflow-hidden group border border-brand-gold/5 hover:border-brand-gold/45 transition-colors duration-500"
          >
            {/* Aspect ratio box for slab portrait look */}
            <div className="aspect-[3/4] w-full relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_urls[0] || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle top-left category badge */}
              <div className="absolute top-4 left-4 z-20 bg-brand-charcoal/80 backdrop-blur-md px-3 py-1 border border-brand-gold/20 text-[9px] uppercase tracking-widest text-brand-gold">
                {product.category_name || "Exotic Slab"}
              </div>

              {/* Status Badge */}
              {product.stock_status !== "in_stock" && (
                <div className="absolute top-4 right-4 z-20 bg-red-950/90 backdrop-blur-md px-3 py-1 border border-red-500/20 text-[9px] uppercase tracking-widest text-red-400">
                  {product.stock_status.replace("_", " ")}
                </div>
              )}

              {/* Luxury gold hover-border overlay */}
              <div className="absolute inset-0 border-[0px] group-hover:border-2 border-brand-gold/60 z-30 transition-all duration-350 pointer-events-none" />

              {/* Gold/Black Slab-Card Overlay (Ace Marbles style sliding overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/90 to-brand-charcoal/30 flex flex-col justify-end p-6 z-20 translate-y-[62%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                
                {/* Always Visible Header part of card */}
                <div className="mb-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-xl sm:text-2xl text-brand-ivory mb-1 tracking-wide font-medium">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brand-gold font-sans uppercase tracking-[0.15em]">
                    {product.colour} • {product.finish}
                  </p>
                </div>

                {/* Hover Reveal part of card */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <div className="h-[1px] w-full bg-brand-gold/20" />
                  
                  {/* Thickness detail */}
                  <div className="flex items-center gap-2 text-xs text-brand-ivory/80">
                    <Layers className="h-4 w-4 text-brand-gold shrink-0" />
                    <span>Available thickness: {product.thickness_options.join(", ")}</span>
                  </div>

                  <Link
                    href={`/collections/${product.slug}`}
                    className="w-full py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
