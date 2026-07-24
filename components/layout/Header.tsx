"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { BrandSettings } from "@/lib/settings";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Gallery", href: "/gallery" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  settings?: BrandSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shortName = settings?.short_name || "Arihant Marbles & Granite";
  const nameParts = shortName.split(" ");
  const firstWord = nameParts[0] || "Arihant";
  const restOfName = nameParts.slice(1).join(" ") || "Marbles & Granite";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        isScrolled
          ? "bg-brand-charcoal/90 backdrop-blur-md border-b border-brand-gold/10 py-4 shadow-lg shadow-black/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl md:text-2xl tracking-widest text-brand-gold font-bold uppercase transition-colors group-hover:text-brand-ivory">
            {firstWord}
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.3em] text-brand-grey uppercase font-sans -mt-1 group-hover:text-brand-gold transition-colors">
            {restOfName}
          </span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-2 text-sm tracking-widest uppercase font-sans text-brand-ivory/80 hover:text-brand-gold transition-colors duration-200"
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center space-x-6">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-brand-ivory hover:text-brand-gold transition-colors p-1"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/contact?quote=true"
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-sans tracking-widest uppercase text-brand-charcoal bg-brand-gold border border-brand-gold hover:bg-transparent hover:text-brand-gold transition-all duration-300 font-semibold rounded-none"
          >
            Get a Quote
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-brand-ivory hover:text-brand-gold transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-brand-charcoal border-b border-brand-gold/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base tracking-widest uppercase font-sans border-b border-white/5 pb-2 flex justify-between items-center ${
                      isActive ? "text-brand-gold font-medium" : "text-brand-ivory/80"
                    }`}
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
              <Link
                href="/contact?quote=true"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 text-sm tracking-widest uppercase text-brand-charcoal bg-brand-gold font-semibold"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
