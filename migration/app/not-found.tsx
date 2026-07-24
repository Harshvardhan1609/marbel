"use client";

import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="bg-brand-charcoal text-brand-ivory min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden text-center">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#B08D3E03_1px,transparent_1px),linear-gradient(to_bottom,#B08D3E03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 404 Card content */}
      <div className="max-w-md relative z-10 space-y-8 p-8 border border-brand-gold/15 bg-[#1F1F1D] shadow-2xl">
        <div className="w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 flex items-center justify-center mx-auto mb-6 text-brand-gold">
          <Compass className="h-7 w-7 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-bold block">
            Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-brand-ivory">
            Slab Not Found
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey font-sans leading-relaxed max-w-xs mx-auto">
            The architectural stone route you are seeking does not exist or has been relocated to another gallery.
          </p>
        </div>

        <div className="h-[1px] w-full bg-brand-gold/15" />

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-grow py-3 bg-brand-gold text-brand-charcoal font-semibold text-xs tracking-widest uppercase hover:bg-brand-ivory hover:text-brand-charcoal transition-colors flex items-center justify-center gap-1.5 rounded-none font-sans"
          >
            <span>Return Home</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/collections"
            className="flex-grow py-3 border border-brand-gold/20 hover:border-brand-gold text-brand-ivory font-semibold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 rounded-none font-sans"
          >
            Browse Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
