"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  category_name: string;
  colour: string;
}

const MOCK_SEARCH_PRODUCTS: SearchProduct[] = [
  { id: "mock-1", name: "Calacatta Oro Marble", slug: "calacatta-oro-marble", category_name: "Italian Marble", colour: "Ivory White" },
  { id: "mock-2", name: "Emerald Quartzite", slug: "emerald-quartzite", category_name: "Exotic Quartzite", colour: "Deep Green & Gold" },
  { id: "mock-3", name: "Arabescato Onyx", slug: "arabescato-onyx", category_name: "Luminous Onyx", colour: "Rose Pink & Ivory" },
  { id: "mock-4", name: "Titanium Gold Granite", slug: "titanium-gold-granite", category_name: "Indian Granite", colour: "Charcoal Black & Gold" },
  { id: "mock-5", name: "Bianco Lasa Marble", slug: "bianco-lasa-marble", category_name: "Italian Marble", colour: "Ice White" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, colour, categories(name)")
          .or(`name.ilike.%${query}%,colour.ilike.%${query}%`)
          .eq("is_published", true)
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          setResults(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              colour: p.colour || "Mixed",
              category_name: (p.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
            }))
          );
        } else {
          // Filter mocks
          const filteredMocks = MOCK_SEARCH_PRODUCTS.filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.colour.toLowerCase().includes(query.toLowerCase()) ||
              p.category_name.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filteredMocks);
        }
      } catch (err) {
        console.error("Search query failed, checking fallbacks:", err);
        const filteredMocks = MOCK_SEARCH_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.colour.toLowerCase().includes(query.toLowerCase()) ||
            p.category_name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredMocks);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (slug: string) => {
    onClose();
    router.push(`/collections/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-brand-charcoal/80 backdrop-blur-md">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Command Palette Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-[#1F1F1D] border border-brand-gold/20 shadow-2xl z-10 text-brand-ivory overflow-hidden"
      >
        {/* Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-brand-gold/10">
          <Search className="h-5 w-5 text-brand-gold mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search slabs by stone name, color, or type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base border-none focus:outline-none placeholder-brand-grey/60 text-brand-ivory"
          />
          {loading ? (
            <Loader2 className="h-5 w-5 text-brand-gold animate-spin shrink-0" />
          ) : (
            <button
              onClick={onClose}
              className="text-brand-grey hover:text-brand-gold transition-colors p-1"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto divide-y divide-brand-gold/5">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-sm text-brand-grey">
              Type to search our curated natural stone catalog.
            </div>
          ) : results.length > 0 ? (
            results.map((res) => (
              <button
                key={res.id}
                onClick={() => handleSelectResult(res.slug)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-brand-charcoal text-left transition-colors duration-200 group"
              >
                <div>
                  <h4 className="font-serif text-base text-brand-ivory group-hover:text-brand-gold transition-colors">
                    {res.name}
                  </h4>
                  <p className="text-xs text-brand-grey mt-0.5">
                    {res.category_name} &bull; {res.colour}
                  </p>
                </div>
                <span className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs uppercase tracking-wider">
                  View Slab
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))
          ) : (
            !loading && (
              <div className="p-8 text-center text-sm text-brand-grey">
                No matching slabs found for &ldquo;{query}&rdquo;.
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
