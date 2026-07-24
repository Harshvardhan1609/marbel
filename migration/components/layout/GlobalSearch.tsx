"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, FileText, Users, Layers, ShieldCheck, X, Sparkles } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Slabs" | "Collections" | "Team" | "Blog";
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Focus input on mount/open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      fetchSearchIndex();
      setQuery("");
      setActiveIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load search index dynamically on open
  const fetchSearchIndex = async () => {
    setLoading(true);
    try {
      const searchItems: SearchItem[] = [];

      // 1. Fetch categories
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug, description")
        .eq("is_published", true);

      if (categories) {
        categories.forEach((cat) => {
          searchItems.push({
            id: `cat-${cat.id}`,
            title: cat.name,
            subtitle: cat.description || "View stone collection sitemap",
            category: "Collections",
            url: `/collections/${cat.slug}`,
          });
        });
      }

      // 2. Fetch products (slabs)
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, colour, finish, categories (slug)")
        .eq("is_published", true);

      if (products) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products.forEach((prod: any) => {
          const categorySlug = prod.categories?.slug || "italian-marbles";
          searchItems.push({
            id: `prod-${prod.id}`,
            title: prod.name,
            subtitle: `${prod.colour} • ${prod.finish} slab`,
            category: "Slabs",
            url: `/collections/${categorySlug}?product=${prod.slug}`,
          });
        });
      }

      // 3. Fetch team members
      const { data: team } = await supabase
        .from("team_members")
        .select("id, name, title")
        .eq("is_published", true);

      if (team) {
        team.forEach((member) => {
          searchItems.push({
            id: `member-${member.id}`,
            title: member.name,
            subtitle: member.title,
            category: "Team",
            url: `/team`,
          });
        });
      }

      // 4. Fetch blog posts
      const { data: blogs } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt")
        .eq("is_published", true);

      if (blogs) {
        blogs.forEach((post) => {
          searchItems.push({
            id: `post-${post.id}`,
            title: post.title,
            subtitle: post.excerpt || "Read design editorial",
            category: "Blog",
            url: `/blog/${post.slug}`,
          });
        });
      }

      setItems(searchItems);
    } catch (err) {
      console.error("Failed to build search index:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter items in-memory
  const filtered = query.trim() === ""
    ? []
    : items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard navigation handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          handleSelect(filtered[activeIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filtered, activeIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.url);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 md:p-12 overflow-y-auto"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-brand-charcoal border border-brand-gold/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 mt-16 md:mt-24"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4.5 border-b border-brand-gold/15 relative">
          <Search className="h-5 w-5 text-brand-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search slabs, collections, legacy story, blog posts..."
            className="flex-grow bg-transparent text-sm text-brand-ivory placeholder-brand-grey/35 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="text-brand-grey hover:text-brand-gold p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Panel */}
        <div className="flex-grow max-h-[50vh] overflow-y-auto min-h-[150px]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-brand-grey text-xs font-sans">
              <div className="h-5 w-5 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
              <span>Indexing site records...</span>
            </div>
          )}

          {!loading && query.trim() === "" && (
            <div className="p-10 text-center space-y-2">
              <Sparkles className="h-8 w-8 text-brand-gold/30 mx-auto animate-pulse" />
              <p className="font-serif text-sm text-brand-ivory">Spotlight Search Dashboard</p>
              <p className="text-[10px] text-brand-grey max-w-xs mx-auto font-sans leading-relaxed">
                Type keywords like <span className="text-brand-gold font-semibold">&quot;Italian&quot;</span>, <span className="text-brand-gold font-semibold">&quot;Granite&quot;</span>, or curators to search records instantly.
              </p>
            </div>
          )}

          {!loading && query.trim() !== "" && filtered.length === 0 && (
            <div className="p-12 text-center text-xs text-brand-grey font-sans">
              No results matching &quot;{query}&quot; found.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="p-2 space-y-1">
              {filtered.map((item, idx) => {
                const isActive = idx === activeIndex;
                const Icon = item.category === "Slabs"
                  ? ShieldCheck
                  : item.category === "Collections"
                  ? Layers
                  : item.category === "Team"
                  ? Users
                  : FileText;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-brand-gold text-brand-charcoal"
                        : "text-brand-ivory hover:bg-brand-charcoal/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-brand-charcoal" : "text-brand-gold"}`} />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold tracking-wide font-sans block truncate leading-tight">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-sans truncate block leading-normal mt-0.5 ${isActive ? "text-brand-charcoal/70" : "text-brand-grey"}`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[8px] uppercase tracking-wider font-bold font-sans px-2 py-0.5 border shrink-0 ${
                      isActive
                        ? "border-brand-charcoal/30 bg-brand-charcoal/10 text-brand-charcoal"
                        : "border-brand-gold/25 bg-brand-charcoal/5 text-brand-gold"
                    }`}>
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Spotlight Footer */}
        <div className="px-6 py-3 border-t border-brand-gold/15 bg-[#151513] flex items-center justify-between font-sans text-[9px] uppercase tracking-widest text-brand-grey select-none">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Enter</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-brand-gold/80 font-bold">
            <span>Powered by Sin Intelligence</span>
          </div>
        </div>

      </div>
    </div>
  );
}
