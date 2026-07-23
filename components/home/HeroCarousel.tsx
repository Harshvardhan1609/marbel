"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070",
    title: "Timeless Stone.",
    subtitle: "Modern Spaces.",
    description: "Hand-selected Calacatta marble slabs curated from historical Italian quarries, bringing natural artistry to bespoke interiors.",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    title: "Exotic Granites.",
    subtitle: "Precision Crafted.",
    description: "Dense, resilient, and uniquely veined slabs processed with Italian line-polishing systems for exceptional architectural applications.",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070",
    title: "Bespoke Onyx.",
    subtitle: "Luminous Luxury.",
    description: "Translucent onyx and quartzite slabs offering architectural illumination, book-matched details, and elite surface styling.",
  },
];

interface CustomSlide {
  title: string;
  subtitle: string;
}

export default function HeroCarousel({ customSlides }: { customSlides?: CustomSlide[] | null }) {
  const [current, setCurrent] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070",
  ];

  const slides = customSlides && customSlides.length > 0
    ? customSlides.map((slide, idx) => ({
        image: images[idx % images.length],
        title: slide.title || "",
        subtitle: "",
        description: slide.subtitle || "",
      }))
    : HERO_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  // Text splitting for staggered reveal
  const headlineWords = `${slide.title} ${slide.subtitle}`.split(" ");

  return (
    <section className="relative h-[95vh] w-full bg-brand-charcoal overflow-hidden flex items-center justify-center">
      {/* Background Slideshow (Ken Burns & Crossfade) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1.08,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Dark overlay for luxury contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-brand-charcoal/45 z-10" />
            
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt="Luxury Stone Slab"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full text-left mt-16">
        <div className="max-w-3xl space-y-6">
          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-xs font-sans tracking-[0.3em] uppercase text-brand-gold font-semibold"
          >
            Sudhir Marbels Curator
          </motion.span>

          {/* Staggered Title Reveal */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-brand-ivory leading-[1.1] tracking-tight">
            <span className="sr-only">{slide.title} {slide.subtitle}</span>
            <span aria-hidden="true" className="flex flex-wrap">
              {headlineWords.map((word, idx) => (
                <span key={`${current}-${word}-${idx}`} className="inline-block overflow-hidden mr-[0.25em] pb-2">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.215, 0.61, 0.355, 1],
                      delay: 0.2 + idx * 0.08,
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <motion.p
            key={`desc-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-brand-ivory/80 max-w-xl font-sans leading-relaxed pt-2"
          >
            {slide.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <Link
              href="/collections"
              className="px-8 py-4 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none shadow-lg shadow-black/25"
            >
              Explore Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?visit=true"
              className="px-8 py-4 border border-brand-ivory/20 hover:border-brand-gold text-brand-ivory hover:text-brand-gold bg-transparent transition-colors duration-300 font-sans text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Calendar className="h-4 w-4" />
              Book a Site Visit
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Progress / Slide Indicators */}
      <div className="absolute bottom-10 right-6 md:right-12 z-20 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group relative flex items-center justify-center p-2 focus:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={`h-[2px] transition-all duration-350 ${
                current === idx ? "w-8 bg-brand-gold" : "w-4 bg-brand-ivory/30 group-hover:bg-brand-ivory"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
