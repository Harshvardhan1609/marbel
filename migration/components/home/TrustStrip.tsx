"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/motion";

const ANNOUNCEMENTS = [
  "Experience our newly arrived Italian Calacatta collection.",
  "Request high-resolution slab videos directly via WhatsApp.",
  "Book-matched slab visualization service available for designers.",
];

export default function TrustStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#1F1F1D] border-y border-brand-gold/10 text-brand-ivory z-30 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-gold/10">
        
        {/* Panel 1: Consultation CTA */}
        <Link
          href="/contact?type=consultation"
          className="group p-8 flex flex-col justify-between hover:bg-brand-charcoal transition-colors duration-300 relative"
        >
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-sans font-semibold block">
              Bespoke Design Service
            </span>
            <h4 className="font-serif text-lg md:text-xl text-brand-ivory group-hover:text-brand-gold transition-colors">
              Get a Free Slab Consultation
            </h4>
            <p className="text-xs text-brand-grey font-sans">
              Work with our stone curators to select the perfect slabs matching your structural blueprints.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-brand-gold mt-6 gap-1 group-hover:gap-2 transition-all">
            Book Consultation
            <ChevronRight className="h-4 w-4" />
          </span>
        </Link>

        {/* Panel 2: Rotating Feature Callout */}
        <div className="p-8 flex flex-col justify-center min-h-[140px] relative overflow-hidden bg-brand-charcoal/30">
          <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-sans font-semibold block mb-3">
            Latest Updates
          </span>
          <div className="relative h-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0 flex items-start gap-2"
              >
                <Sparkles className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-sans leading-relaxed text-brand-ivory/90 pr-4">
                  {ANNOUNCEMENTS[index]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Panel 3: Stats count-up & avatars */}
        <div className="p-8 flex items-center justify-between hover:bg-brand-charcoal/20 transition-colors">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-sans font-semibold block">
              Global Footprint
            </span>
            <h4 className="font-serif text-2xl md:text-3xl text-brand-gold font-bold">
              <AnimatedCounter to={500} suffix="+" />
            </h4>
            <p className="text-xs text-brand-grey font-sans">
              Bespoke residential & commercial projects delivered worldwide.
            </p>
          </div>

          {/* Overlapping Avatar Cluster */}
          <div className="flex -space-x-3 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-charcoal object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120"
              alt="Architect Customer"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-charcoal object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120"
              alt="Designer Customer"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-charcoal object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120"
              alt="Client Customer"
            />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-charcoal font-sans text-xs font-bold ring-2 ring-brand-charcoal">
              SM
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
