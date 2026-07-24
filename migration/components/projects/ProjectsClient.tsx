"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_urls: string[];
  location: string;
  completion_date: string;
  category: "residential" | "hospitality" | "commercial";
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<"all" | "residential" | "hospitality" | "commercial">("all");

  const filteredProjects =
    filter === "all" ? initialProjects : initialProjects.filter((p) => p.category === filter);

  return (
    <div className="space-y-12">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(["all", "residential", "hospitality", "commercial"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 text-xs font-sans tracking-widest uppercase border transition-all ${
              filter === tab
                ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                : "border-brand-charcoal/10 hover:border-brand-gold text-brand-charcoal"
            }`}
          >
            {tab === "all" ? "All Projects" : `${tab} spaces`}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-brand-charcoal text-brand-ivory relative overflow-hidden group border border-brand-gold/10 hover:border-brand-gold/45 transition-colors duration-500"
            >
              <div className="aspect-[16/10] w-full relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image_urls[0]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Bottom detail slide-up */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/70 to-transparent flex flex-col justify-end p-6 md:p-8 z-20">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-gold text-[9px] uppercase tracking-widest">
                      <span>{project.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl text-brand-ivory font-medium tracking-wide">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs text-brand-grey font-sans line-clamp-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.description}
                    </p>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-brand-gold pt-2 group-hover:gap-2.5 transition-all"
                    >
                      View Case Study
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Accent gold borders */}
                <div className="absolute inset-0 border-[0px] group-hover:border-2 border-brand-gold/55 z-30 transition-all duration-350 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
