"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Italian Marbles",
    slug: "italian-marbles",
    description: "Sinuous veins and pristine, radiant whites.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
  },
  {
    name: "Indian Granites",
    slug: "indian-granites",
    description: "Steadfast density and deep, speckled textures.",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600",
  },
  {
    name: "Exotic Quartzite",
    slug: "quartzite",
    description: "Nature's crystalline, ultra-durable masterpiece.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600",
  },
  {
    name: "Premium Quartz",
    slug: "quartz",
    description: "Engineered resilience with seamless, sleek finishes.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600",
  },
  {
    name: "Luminous Onyx",
    slug: "onyx",
    description: "Translucent layered crystals ideal for backlighting.",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600",
  },
  {
    name: "Classic Travertine",
    slug: "travertine",
    description: "Porous architectural character and Roman legacy.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
  },
  {
    name: "Serene Limestone",
    slug: "limestone",
    description: "Soft sandy tones and matte, tactile serenity.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600",
  },
  {
    name: "Bespoke Tiles",
    slug: "stone-tiles",
    description: "Precision modular cuts for sophisticated flooring.",
    image: "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?q=80&w=600",
  },
];

interface DB_Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}

export default function CategoryGrid({
  categories,
  customOrder,
}: {
  categories?: DB_Category[];
  customOrder?: string[] | null;
}) {
  const dbCategoriesMapped = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        image: c.image_url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      }))
    : CATEGORIES;

  const orderedCategories = [...dbCategoriesMapped];
  if (customOrder && customOrder.length > 0) {
    orderedCategories.sort((a, b) => {
      const idxA = customOrder.indexOf(a.slug);
      const idxB = customOrder.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }


  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-brand-ivory text-brand-charcoal">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Stone Classifications
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-brand-charcoal">
            Browse by Stone Category
          </h2>
        </div>
        <p className="max-w-md text-sm text-brand-grey font-sans leading-relaxed">
          Each slab type possesses distinct geological histories, density levels, and finishing options custom-suited to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderedCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/collections?category=${cat.slug}`}
            className="group relative h-96 overflow-hidden bg-brand-charcoal block cursor-pointer"
          >
            {/* Background Image with Hover Scale */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/30 to-transparent z-10" />

            {/* Content Layer */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 text-brand-ivory">
              <span className="w-8 h-8 rounded-full border border-brand-ivory/20 flex items-center justify-center mb-4 ml-auto group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-charcoal transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </span>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl text-brand-ivory font-semibold tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-brand-ivory/70 font-sans leading-relaxed line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {cat.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
