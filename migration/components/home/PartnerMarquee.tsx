"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  "AURA ARCHITECTS",
  "DECOR ASSOCIATES",
  "KISHANGARH DESIGNS",
  "VERDE LUXURY RESIDENCES",
  "KRAFT DESIGN STUDIO",
  "JAIPUR STONE BUILDERS",
  "MONOLITH HOMES",
];

export default function PartnerMarquee() {
  // Triple the list of partners to ensure there is enough horizontal width to prevent visual gaps during transitions
  const loopList = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-16 bg-[#161615] border-t border-brand-gold/5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 text-center">
        <span className="text-[10px] tracking-[0.3em] uppercase text-brand-grey font-sans font-semibold">
          Trusted by Elite Architects & Developers
        </span>
      </div>

      <div className="relative flex overflow-x-hidden w-full mask-gradient">
        {/* Subtle blur fading left and right to blend with layout edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#161615] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#161615] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex space-x-16 whitespace-nowrap shrink-0 pr-16"
          animate={{
            x: ["0%", "-33.33%"],
          }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {loopList.map((partner, idx) => (
            <div
              key={idx}
              className="text-sm md:text-base font-sans tracking-[0.3em] text-brand-grey/40 hover:text-brand-gold/80 transition-colors duration-300 font-bold uppercase"
            >
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
