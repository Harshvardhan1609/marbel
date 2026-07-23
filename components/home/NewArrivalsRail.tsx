import { createClient } from "@/lib/supabase/server";
import NewArrivalsRailClient from "./NewArrivalsRailClient";

// Typed Mock Fallbacks in case database is empty or connection fails
const MOCK_NEW_ARRIVALS = [
  {
    id: "mock-1",
    name: "Calacatta Oro Marble",
    slug: "calacatta-oro-marble",
    colour: "Ivory White",
    finish: "Polished",
    thickness_options: ["18mm", "20mm"],
    image_urls: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_name: "Italian Marble",
  },
  {
    id: "mock-2",
    name: "Emerald Quartzite",
    slug: "emerald-quartzite",
    colour: "Deep Green & Gold",
    finish: "Leathered",
    thickness_options: ["20mm"],
    image_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_name: "Exotic Quartzite",
  },
  {
    id: "mock-3",
    name: "Arabescato Onyx",
    slug: "arabescato-onyx",
    colour: "Rose Pink & Ivory",
    finish: "Bookmatched Polished",
    thickness_options: ["18mm", "20mm"],
    image_urls: ["https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600"],
    stock_status: "limited" as const,
    category_name: "Luminous Onyx",
  },
  {
    id: "mock-4",
    name: "Titanium Gold Granite",
    slug: "titanium-gold-granite",
    colour: "Charcoal Black & Gold",
    finish: "Satin",
    thickness_options: ["20mm", "30mm"],
    image_urls: ["https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_name: "Indian Granite",
  },
  {
    id: "mock-5",
    name: "Bianco Lasa Marble",
    slug: "bianco-lasa-marble",
    colour: "Ice White",
    finish: "Polished",
    thickness_options: ["18mm"],
    image_urls: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_name: "Italian Marble",
  },
];

export default async function NewArrivalsRail() {
  let products = [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, colour, finish, thickness_options, image_urls, stock_status, categories(name)")
      .eq("is_new_arrival", true)
      .eq("is_published", true)
      .limit(6);

    if (error) throw error;
    if (data && data.length > 0) {
      products = data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        colour: p.colour || "Mixed",
        finish: p.finish || "Polished",
        thickness_options: p.thickness_options || ["20mm"],
        image_urls: p.image_urls || [],
        stock_status: p.stock_status,
        category_name: (p.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
      }));
    } else {
      products = MOCK_NEW_ARRIVALS;
    }
  } catch (error) {
    console.error("Failed to fetch new arrivals from Supabase, using mock fallback data:", error);
    products = MOCK_NEW_ARRIVALS;
  }

  return <NewArrivalsRailClient products={products} />;
}
