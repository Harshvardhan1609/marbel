"use client";

import { useState, useRef } from "react";
import { Info, RefreshCw, Layers } from "lucide-react";

interface SlabOption {
  id: string;
  name: string;
  url: string;
  colour: string;
  finish: string;
}

const SLABS: SlabOption[] = [
  {
    id: "slab-1",
    name: "Calacatta Oro Marble",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    colour: "White",
    finish: "Polished",
  },
  {
    id: "slab-2",
    name: "Emerald Quartzite",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    colour: "Green",
    finish: "Leathered",
  },
  {
    id: "slab-3",
    name: "Arabescato Onyx",
    url: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600",
    colour: "Pink",
    finish: "Bookmatched",
  },
  {
    id: "slab-4",
    name: "Titanium Gold Granite",
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600",
    colour: "Black",
    finish: "Satin",
  },
];

const TEMPLATES = [
  {
    id: "floor",
    name: "Living Room Floor",
    baseImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800",
    blendMode: "overlay" as const,
    opacity: 0.85,
  },
  {
    id: "kitchen",
    name: "Kitchen Countertop",
    baseImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
    blendMode: "multiply" as const,
    opacity: 0.9,
  },
  {
    id: "bathroom",
    name: "Bathroom Wall",
    baseImage: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800",
    blendMode: "overlay" as const,
    opacity: 0.8,
  },
];

export default function RoomVisualizerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [slabLeft, setSlabLeft] = useState(SLABS[0]);
  const [slabRight, setSlabRight] = useState(SLABS[1]);

  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Page Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Digital Studio
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Room Visualizer
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Overlay imported granite and marble slabs on architectural spaces. Drag the slider to compare two options side-by-side.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Compare visualizer */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Compare Container */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            className="aspect-[16/10] w-full relative overflow-hidden bg-brand-charcoal border border-brand-gold/15 select-none touch-none cursor-ew-resize"
          >
            {/* 1. Base Layer (Right Slab Option) */}
            <div className="absolute inset-0 w-full h-full">
              {/* Slabs texture layer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slabRight.url}
                alt="Right Stone slab"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Room template mask overlaid with blend-mode */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedTemplate.baseImage}
                alt={selectedTemplate.name}
                style={{
                  mixBlendMode: selectedTemplate.blendMode,
                  opacity: selectedTemplate.opacity,
                }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* 2. Top Layer (Left Slab Option) - Width linked to sliderPosition */}
            <div
              className="absolute inset-0 h-full overflow-hidden z-10 border-r border-brand-gold/40"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Top slab texture - must keep full screen width so texture maps without stretch */}
              <div
                className="h-full absolute top-0 left-0"
                style={{ width: containerRef.current?.getBoundingClientRect().width || "100%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slabLeft.url}
                  alt="Left Stone slab"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTemplate.baseImage}
                  alt={selectedTemplate.name}
                  style={{
                    mixBlendMode: selectedTemplate.blendMode,
                    opacity: selectedTemplate.opacity,
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>

            {/* 3. Slider handle bar */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-brand-gold z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-charcoal border border-brand-gold text-brand-gold flex items-center justify-center shadow-lg">
                <RefreshCw className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Option labels */}
            <div className="absolute top-4 left-4 bg-brand-charcoal/80 border border-brand-gold/15 text-brand-gold text-[9px] uppercase tracking-widest px-3 py-1 z-30 font-semibold font-sans">
              Left: {slabLeft.name}
            </div>
            <div className="absolute top-4 right-4 bg-brand-charcoal/80 border border-brand-gold/15 text-brand-gold text-[9px] uppercase tracking-widest px-3 py-1 z-30 font-semibold font-sans">
              Right: {slabRight.name}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-brand-charcoal/5 border border-brand-gold/10 text-brand-grey font-sans text-xs">
            <Info className="h-4 w-4 text-brand-gold shrink-0" />
            <span>Click and drag/swipe inside the photo view to compare textures. CSS multiply/overlay blend modes mimic structural highlights and shade depths.</span>
          </div>
        </div>

        {/* Right Column: Selections and Configuration */}
        <div className="lg:col-span-4 space-y-8 flex flex-col justify-start">
          {/* Room Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-brand-grey font-sans font-bold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-brand-gold" />
              1. Select Room Template
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {TEMPLATES.map((temp) => (
                <button
                  key={temp.id}
                  onClick={() => setSelectedTemplate(temp)}
                  className={`w-full p-4 text-left text-xs font-sans uppercase tracking-widest border transition-all ${
                    selectedTemplate.id === temp.id
                      ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                      : "border-brand-charcoal/10 text-brand-charcoal hover:border-brand-gold"
                  }`}
                >
                  {temp.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] w-full bg-brand-gold/15" />

          {/* Left Stone Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-brand-grey font-sans font-bold block">
              2. Left Slab Material
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SLABS.map((slab) => (
                <button
                  key={slab.id}
                  onClick={() => setSlabLeft(slab)}
                  className={`p-3 text-left border transition-all rounded-none ${
                    slabLeft.id === slab.id
                      ? "border-brand-gold bg-brand-charcoal text-brand-gold"
                      : "border-brand-charcoal/10 text-brand-grey hover:border-brand-gold"
                  }`}
                >
                  <span className="font-serif text-xs block font-semibold leading-tight">{slab.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-brand-grey block mt-1">{slab.colour}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Stone Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-brand-grey font-sans font-bold block">
              3. Right Slab Material
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SLABS.map((slab) => (
                <button
                  key={slab.id}
                  onClick={() => setSlabRight(slab)}
                  className={`p-3 text-left border transition-all rounded-none ${
                    slabRight.id === slab.id
                      ? "border-brand-gold bg-brand-charcoal text-brand-gold"
                      : "border-brand-charcoal/10 text-brand-grey hover:border-brand-gold"
                  }`}
                >
                  <span className="font-serif text-xs block font-semibold leading-tight">{slab.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-brand-grey block mt-1">{slab.colour}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
