"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string;
  company: string;
  quote: string;
  avatar_url: string;
  video_thumbnail?: string;
  video_url?: string;
}

interface TestimonialsCarouselClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarouselClient({ testimonials }: TestimonialsCarouselClientProps) {
  const [current, setCurrent] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const testimonial = testimonials[current];

  return (
    <section className="py-24 px-6 md:px-12 bg-brand-charcoal text-brand-ivory border-t border-brand-gold/10 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-charcoal via-brand-charcoal/90 to-brand-charcoal/50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-brand-ivory">
            Architect & Client Voices
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto" />
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[400px]">
          
          {/* Quote Panel */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
            <Quote className="h-12 w-12 text-brand-gold/30 shrink-0" />

            <div className="relative min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <p className="text-lg md:text-2xl font-serif italic text-brand-ivory/90 leading-relaxed font-light">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.author_name}
                      className="w-12 h-12 rounded-full object-cover border border-brand-gold/25"
                    />
                    <div>
                      <h4 className="font-serif text-base text-brand-gold font-semibold">
                        {testimonial.author_name}
                      </h4>
                      <p className="text-xs text-brand-grey font-sans uppercase tracking-wider">
                        {testimonial.author_title} &bull; {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center space-x-4 pt-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 border border-brand-ivory/15 hover:border-brand-gold text-brand-ivory hover:text-brand-gold flex items-center justify-center transition-colors duration-300 rounded-none focus:outline-none"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-sans text-brand-grey uppercase tracking-widest">
                {current + 1} / {testimonials.length}
              </span>
              <button
                onClick={handleNext}
                className="w-10 h-10 border border-brand-ivory/15 hover:border-brand-gold text-brand-ivory hover:text-brand-gold flex items-center justify-center transition-colors duration-300 rounded-none focus:outline-none"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Optional Video Thumbnail Panel */}
          <div className="lg:col-span-5 flex justify-center">
            {testimonial.video_thumbnail && testimonial.video_url ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-video w-full max-w-md group overflow-hidden border border-brand-gold/15 bg-brand-charcoal"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.video_thumbnail}
                  alt="Client Interview Preview"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <button
                    onClick={() => setVideoUrl(testimonial.video_url || null)}
                    className="w-16 h-16 rounded-full bg-brand-gold text-brand-charcoal hover:bg-brand-ivory transition-all duration-300 flex items-center justify-center shadow-2xl hover:scale-110"
                    aria-label="Play video testimonial"
                  >
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </button>
                </div>
              </motion.div>
            ) : (
              // Decorative stone placeholder graphic when no video is present
              <div className="aspect-video w-full max-w-md border border-brand-gold/10 bg-brand-charcoal/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-brand-gold/10 flex items-center justify-center text-brand-gold/40">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="text-xs text-brand-grey font-sans max-w-xs">
                  We maintain absolute project confidentiality. Client testimonials are published with permission.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              onClick={() => setVideoUrl(null)}
              className="absolute top-6 right-6 text-brand-ivory hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative aspect-video w-full max-w-4xl bg-black border border-brand-gold/10"
            >
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
