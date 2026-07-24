"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye, Grid } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

interface GalleryClientProps {
  initialItems: GalleryItem[];
  categories: string[];
}

export default function GalleryClient({ initialItems, categories }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems = selectedCategory === "All"
    ? initialItems
    : initialItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-brand-gold/10 pb-6">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2 text-xs uppercase tracking-widest font-sans font-semibold border transition-all ${
            selectedCategory === "All"
              ? "bg-brand-gold border-brand-gold text-brand-charcoal"
              : "border-transparent text-brand-grey hover:text-brand-charcoal hover:bg-brand-charcoal/5"
          }`}
        >
          All Slabs
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-widest font-sans font-semibold border transition-all ${
              selectedCategory === cat
                ? "bg-brand-gold border-brand-gold text-brand-charcoal"
                : "border-transparent text-brand-grey hover:text-brand-charcoal hover:bg-brand-charcoal/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Slabs */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] bg-brand-charcoal border border-brand-gold/10 hover:border-brand-gold/40 overflow-hidden cursor-pointer shadow-md"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-75"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold font-sans">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg text-brand-ivory font-medium tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <span className="p-2 border border-brand-gold/30 bg-brand-charcoal/80 text-brand-gold rounded-full">
                    <Eye className="h-4.5 w-4.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-24 border border-brand-gold/10 bg-brand-charcoal/5 space-y-4">
          <Grid className="h-10 w-10 text-brand-gold mx-auto opacity-40 animate-pulse" />
          <h3 className="font-serif text-xl text-brand-charcoal">No Slabs Available</h3>
          <p className="text-xs text-brand-grey max-w-xs mx-auto font-sans leading-relaxed">
            There are currently no published showcase items listed in the {selectedCategory} category.
          </p>
        </div>
      )}

      {/* Full-screen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 md:p-12 select-none"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-brand-ivory/80 hover:text-white p-2 border border-white/10 bg-brand-charcoal/40 hover:bg-brand-charcoal rounded-full transition-colors z-55"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-brand-ivory/80 hover:text-white p-3 border border-white/10 bg-brand-charcoal/40 hover:bg-brand-charcoal rounded-full transition-colors z-55"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 text-brand-ivory/80 hover:text-white p-3 border border-white/10 bg-brand-charcoal/40 hover:bg-brand-charcoal rounded-full transition-colors z-55"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Lightbox Content Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col items-center gap-6"
            >
              {/* Dynamic Image Wrapper */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="max-h-[70vh] max-w-full overflow-hidden border border-brand-gold/25 relative flex items-center justify-center bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </motion.div>

              {/* Text Info */}
              <motion.div
                key={`info-${lightboxIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center space-y-2 max-w-xl"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-bold font-sans">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-brand-ivory font-medium tracking-wide">
                  {filteredItems[lightboxIndex].title}
                </h2>
                {filteredItems[lightboxIndex].description && (
                  <p className="text-xs text-brand-grey font-sans leading-relaxed">
                    {filteredItems[lightboxIndex].description}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
