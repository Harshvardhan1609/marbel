"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FilterX, SlidersHorizontal, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  thickness_options: string[];
  image_urls: string[];
  stock_status: "in_stock" | "limited" | "sold_out";
  category_name?: string;
}

interface CollectionsClientProps {
  categories: Category[];
  products: Product[];
  colours: string[];
  finishes: string[];
  applications: string[];
}

export default function CollectionsClient({
  categories,
  products,
  colours,
  finishes,
  applications,
}: CollectionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") || "all";
  const activeColour = searchParams.get("colour") || "all";
  const activeFinish = searchParams.get("finish") || "all";
  const activeApplication = searchParams.get("application") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Smooth router navigation transition
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeColour !== "all" ||
    activeFinish !== "all" ||
    activeApplication !== "all";

  return (
    <div className="space-y-8 pb-24">
      {/* Sticky Filters Bar */}
      <div className="sticky top-20 bg-brand-ivory/90 dark:bg-brand-charcoal/90 backdrop-blur-md z-30 py-4 border-b border-brand-gold/15 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-sans font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter Slabs</span>
            {isPending && <Loader2 className="h-4.5 w-4.5 animate-spin text-brand-gold ml-2" />}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={activeCategory}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="bg-brand-charcoal text-brand-ivory text-xs font-sans tracking-wider uppercase px-3 py-2.5 focus:outline-none border border-brand-gold/25 focus:border-brand-gold rounded-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Colour Filter */}
            <select
              value={activeColour}
              onChange={(e) => handleFilterChange("colour", e.target.value)}
              className="bg-brand-charcoal text-brand-ivory text-xs font-sans tracking-wider uppercase px-3 py-2.5 focus:outline-none border border-brand-gold/25 focus:border-brand-gold rounded-none cursor-pointer"
            >
              <option value="all">All Colours</option>
              {colours.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {/* Finish Filter */}
            <select
              value={activeFinish}
              onChange={(e) => handleFilterChange("finish", e.target.value)}
              className="bg-brand-charcoal text-brand-ivory text-xs font-sans tracking-wider uppercase px-3 py-2.5 focus:outline-none border border-brand-gold/25 focus:border-brand-gold rounded-none cursor-pointer"
            >
              <option value="all">All Finishes</option>
              {finishes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* Application Filter */}
            <select
              value={activeApplication}
              onChange={(e) => handleFilterChange("application", e.target.value)}
              className="bg-brand-charcoal text-brand-ivory text-xs font-sans tracking-wider uppercase px-3 py-2.5 focus:outline-none border border-brand-gold/25 focus:border-brand-gold rounded-none cursor-pointer"
            >
              <option value="all">All Applications</option>
              {applications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 font-sans font-semibold flex items-center justify-center gap-1.5 border border-red-500/25 px-4 py-2 hover:bg-red-950/10 transition-colors shrink-0"
            >
              <FilterX className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {products.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 border border-dashed border-brand-gold/10 bg-brand-charcoal/5">
            <FilterX className="h-12 w-12 text-brand-gold/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-brand-charcoal mb-2">No Slabs Match Filters</h3>
            <p className="text-sm text-brand-grey font-sans max-w-sm mx-auto mb-6">
              Try adjusting your color, finish, or type selections, or reset the filters to browse our standard collections.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-brand-gold text-brand-charcoal font-sans text-xs font-semibold tracking-widest uppercase hover:bg-brand-charcoal hover:text-brand-ivory transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
