"use client";

import { AnimatedCounter } from "@/components/motion";

const STATS_ITEMS = [
  {
    to: 25,
    suffix: "+",
    label: "Years of Excellence",
    description: "Curating and processing nature's masterpieces since 2001.",
  },
  {
    to: 180,
    suffix: "+",
    label: "Stone Varieties",
    description: "Unique selections of marble, granite, onyx, and quartzite.",
  },
  {
    to: 1200,
    suffix: "+",
    label: "Completed Projects",
    description: "Bespoke residences, high-end hotels, and civic structures.",
  },
  {
    to: 500,
    suffix: "k+",
    label: "Sqft Slabs in Stock",
    description: "Ready-to-ship premium inventory housed in our warehouses.",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-brand-charcoal border-y border-brand-gold/10 text-brand-ivory py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background marble vein accent drawing */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#B08D3E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-brand-gold/10">
          {STATS_ITEMS.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-3 justify-center ${
                idx > 0 ? "sm:pt-0 pt-8" : ""
              } lg:px-8`}
            >
              {/* Animated number */}
              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-gold font-bold tracking-tight">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} />
              </h3>

              {/* Label */}
              <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-brand-ivory font-semibold">
                {stat.label}
              </h4>

              {/* Description */}
              <p className="text-xs text-brand-grey font-sans leading-relaxed max-w-[240px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
