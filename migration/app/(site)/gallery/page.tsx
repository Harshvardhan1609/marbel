import { createClient } from "@/lib/supabase/server";
import GalleryClient from "@/components/gallery/GalleryClient";

export const dynamic = "force-dynamic";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

const FALLBACK_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "Pristine White Carrara",
    description: "Classic Italian Carrara marble slab showing signature soft grey veining detail.",
    image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    category: "Italian Marbles",
  },
  {
    id: "g-2",
    title: "Luminous Emerald Quartzite",
    description: "Stunning translucent quartzite slabs highlighting rich green crystalline veining.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    category: "Exotic Quartzite",
  },
  {
    id: "g-3",
    title: "Arabescato Onyx Highlight",
    description: "Backlit onyx slab swirling with organic lines of pink and warm translucent amber.",
    image_url: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600",
    category: "Luminous Onyx",
  },
  {
    id: "g-4",
    title: "Bespoke Living Room Flooring",
    description: "Bookmatched Italian marble layout completed for a luxury penthouse residence in Jaipur.",
    image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600",
    category: "Installations",
  },
  {
    id: "g-5",
    title: "Block Curation Inspection",
    description: "Inspectors hand-selecting premium raw stone blocks direct at the processing plant yard.",
    image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600",
    category: "Processing",
  },
];

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  let categories: string[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, description, image_url, category")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      items = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        image_url: item.image_url,
        category: item.category || "General",
      }));
    } else {
      items = FALLBACK_ITEMS;
    }
  } catch (e) {
    console.error("Failed to query gallery items:", e);
    items = FALLBACK_ITEMS;
  }

  // Extract unique categories for filter tabs
  categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Stone Showcase
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Curated Slab Gallery
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Browse high-resolution captures of our premium marble blocks, exotic quartzites, back-lit onyx slabs, and finished architectural applications.
          </p>
        </div>
      </div>

      {/* Gallery Interaction Client */}
      <GalleryClient initialItems={items} categories={categories} />
    </div>
  );
}
