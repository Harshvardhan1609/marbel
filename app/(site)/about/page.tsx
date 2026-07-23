"use client";

import { Compass, Award, Cpu, Truck, CheckSquare } from "lucide-react";
import { ScrollReveal, StaggerContainer } from "@/components/motion";

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Quarry Sourcing",
    icon: Compass,
    description: "Our stone curators travel globally to Italian, Greek, Brazilian, and Indian quarries, inspecting and hand-selecting raw stone blocks showing unique veining structures.",
  },
  {
    num: "02",
    title: "Advanced Processing",
    icon: Cpu,
    description: "In our Kishangarh facility, blocks are sliced using Italian gang-saws and line-polished under controlled temperatures to maximize natural quartzite and marble lustre.",
  },
  {
    num: "03",
    title: "Rigorous Quality Check",
    icon: CheckSquare,
    description: "Slabs undergo laser-guided thickness checks, structural soundness testing, and bookmatched alignment dry-lays before approval for shipping.",
  },
  {
    num: "04",
    title: "Delivery & Install",
    icon: Truck,
    description: "Slabs are securely packaged in tailored steel A-frames for sea/land transport, accompanied by detailed layout blueprints for bookmatch installation.",
  },
];

const INFRASTRUCTURE_STATS = [
  { value: "120,000", label: "Sqft Factory Space", desc: "State-of-the-art Kishangarh processing plant." },
  { value: "18+", label: "Italian Saws & Polishers", desc: "Advanced line-polishing and slab cutting." },
  { value: "50,000+", label: "Slabs Managed Yearly", desc: "Securing inventory for massive commercial projects." },
  { value: "25+", label: "Export Destinations", desc: "Shipping marble globally to 5 continents." },
];

const CERTIFICATIONS = [
  "ISO 9001:2015 Quality Certified",
  "Indian Stone Association Member",
  "FIEO Export Council Gold Member",
  "CE Safety & Compliance Certified",
  "Italian Processing Standard Certified",
];

export default function AboutPage() {
  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Hero Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Our Legacy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            The Sudhir Story
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Sourcing geological masterpieces since 2001. Learn how we curating, processing, and delivering unique marble and granite to global structures.
          </p>
        </div>
      </div>

      {/* Legacy/History Block */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-brand-gold font-sans font-semibold block">
            Sourced by Artistry
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-brand-charcoal">
            Two Decades of Curating Nature&apos;s Masterpieces
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold" />
          <p className="text-sm text-brand-grey font-sans leading-relaxed font-light">
            Founded with a passion for architectural stone curation, Sudhir Marbels has evolved from a local trading office into one of Kishangarh&apos;s premier processing plants. We believe that stone is not just a building material, but a permanent canvas of Earth&apos;s historical art.
          </p>
          <p className="text-sm text-brand-grey font-sans leading-relaxed font-light">
            Our teams consult directly with architects, builders, and structural designers globally, matching stone densities and aesthetic veining options to bespoke layouts.
          </p>
        </div>
        <div className="lg:col-span-6 relative aspect-video lg:aspect-square overflow-hidden border border-brand-gold/15 bg-brand-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800"
            alt="Stone Processing Plant"
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Animated Process Timeline */}
      <section className="py-24 bg-[#1F1F1D] text-brand-ivory border-y border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
              Workflow Pipeline
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-ivory">
              From Quarry to Installation
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto" />
            <p className="text-xs text-brand-grey font-sans">
              Our comprehensive four-step workflow ensures structural resilience and aesthetic perfection.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <ScrollReveal
                  key={step.num}
                  yOffset={40}
                  className="bg-brand-charcoal border border-brand-gold/10 hover:border-brand-gold/40 p-8 transition-all duration-300 relative group"
                >
                  <div className="absolute top-4 right-4 text-3xl font-serif font-bold text-brand-gold/10 group-hover:text-brand-gold/20 transition-colors">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center mb-6">
                    <Icon className="h-5 w-5 text-brand-gold" />
                  </div>
                  <h3 className="font-serif text-lg text-brand-ivory mb-3 font-semibold tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-brand-grey leading-relaxed font-sans">
                    {step.description}
                  </p>
                </ScrollReveal>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Infrastructure Stats */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
              Processing Capability
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal">
              Industrial Infrastructure
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INFRASTRUCTURE_STATS.map((stat, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.1}
              className="text-center border border-brand-charcoal/5 bg-brand-charcoal/5 p-8"
            >
              <h3 className="font-serif text-4xl text-brand-gold font-bold mb-2">
                {stat.value}
              </h3>
              <h4 className="font-sans text-xs uppercase tracking-widest text-brand-charcoal font-semibold mb-2">
                {stat.label}
              </h4>
              <p className="text-xs text-brand-grey font-sans leading-relaxed">
                {stat.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Certifications row */}
      <section className="py-16 bg-[#161615] border-t border-brand-gold/5 overflow-hidden select-none text-brand-ivory/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-grey font-sans font-semibold">
            Quality Certifications & Affiliations
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert}
              className="flex items-center gap-2 border border-brand-gold/10 px-4 py-2 text-xs font-sans font-medium bg-brand-charcoal/50 text-brand-grey"
            >
              <Award className="h-4 w-4 text-brand-gold" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
