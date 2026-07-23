import { createClient } from "@/lib/supabase/server";
import ProductsAdminClient from "@/components/admin/ProductsAdminClient";

export const dynamic = "force-dynamic";

// Typed Mock Database matching collections page.tsx
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Italian Marbles", slug: "italian-marbles" },
  { id: "cat-2", name: "Indian Granites", slug: "indian-granites" },
  { id: "cat-3", name: "Exotic Quartzite", slug: "quartzite" },
  { id: "cat-4", name: "Premium Quartz", slug: "quartz" },
  { id: "cat-5", name: "Luminous Onyx", slug: "onyx" },
  { id: "cat-6", name: "Classic Travertine", slug: "travertine" },
  { id: "cat-7", name: "Serene Limestone", slug: "limestone" },
  { id: "cat-8", name: "Bespoke Tiles", slug: "stone-tiles" },
];

const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Calacatta Oro Marble",
    slug: "calacatta-oro-marble",
    colour: "White",
    finish: "Polished",
    thickness_options: ["18mm", "20mm"],
    image_urls: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_id: "cat-1",
    category_name: "Italian Marbles",
    applications: ["Flooring", "Wall Cladding", "Countertop"],
  },
  {
    id: "prod-2",
    name: "Emerald Quartzite",
    slug: "emerald-quartzite",
    colour: "Green",
    finish: "Leathered",
    thickness_options: ["20mm"],
    image_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_id: "cat-3",
    category_name: "Exotic Quartzite",
    applications: ["Wall Cladding", "Countertop"],
  },
  {
    id: "prod-3",
    name: "Arabescato Onyx",
    slug: "arabescato-onyx",
    colour: "Pink",
    finish: "Bookmatched",
    thickness_options: ["18mm", "20mm"],
    image_urls: ["https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600"],
    stock_status: "limited" as const,
    category_id: "cat-5",
    category_name: "Luminous Onyx",
    applications: ["Wall Cladding"],
  },
];

export default async function AdminProductsPage() {
  let products = [];
  let categories = [];

  try {
    const supabase = createClient();

    // 1. Fetch categories
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, slug");
    
    categories = catData && catData.length > 0 ? catData : MOCK_CATEGORIES;

    // 2. Fetch products
    const { data: prodData, error: prodError } = await supabase
      .from("products")
      .select("id, name, slug, colour, finish, thickness_options, image_urls, stock_status, category_id, applications, categories(id, name, slug)")
      .order("created_at", { ascending: false });

    if (prodError) throw prodError;

    if (prodData && prodData.length > 0) {
      products = prodData.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        colour: p.colour || "Mixed",
        finish: p.finish || "Polished",
        thickness_options: p.thickness_options || ["20mm"],
        image_urls: p.image_urls || [],
        stock_status: p.stock_status,
        category_id: p.category_id || "",
        category_name: (p.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
        applications: p.applications || [],
      }));
    } else {
      products = MOCK_PRODUCTS;
    }
  } catch (err) {
    console.error("Failed to query products from Supabase, using mock inventory:", err);
    categories = MOCK_CATEGORIES;
    products = MOCK_PRODUCTS;
  }

  return (
    <ProductsAdminClient
      initialProducts={products}
      categories={categories}
    />
  );
}
