import { FileText, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CollectionsClient from "@/components/collections/CollectionsClient";

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
    category_slug: "italian-marbles",
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
    category_slug: "quartzite",
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
    category_slug: "onyx",
    category_name: "Luminous Onyx",
    applications: ["Wall Cladding"],
  },
  {
    id: "prod-4",
    name: "Titanium Gold Granite",
    slug: "titanium-gold-granite",
    colour: "Black",
    finish: "Satin",
    thickness_options: ["20mm", "30mm"],
    image_urls: ["https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_slug: "indian-granites",
    category_name: "Indian Granites",
    applications: ["Flooring", "Countertop", "Parking"],
  },
  {
    id: "prod-5",
    name: "Bianco Lasa Marble",
    slug: "bianco-lasa-marble",
    colour: "White",
    finish: "Polished",
    thickness_options: ["18mm"],
    image_urls: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600"],
    stock_status: "in_stock" as const,
    category_slug: "italian-marbles",
    category_name: "Italian Marbles",
    applications: ["Flooring", "Wall Cladding"],
  },
  {
    id: "prod-6",
    name: "Crema Marfil Travertine",
    slug: "crema-marfil-travertine",
    colour: "Beige",
    finish: "Honed",
    thickness_options: ["20mm"],
    image_urls: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"],
    stock_status: "sold_out" as const,
    category_slug: "travertine",
    category_name: "Classic Travertine",
    applications: ["Flooring", "Parking"],
  },
];

const COLOURS = ["White", "Black", "Green", "Pink", "Beige", "Grey"];
const FINISHES = ["Polished", "Leathered", "Bookmatched", "Satin", "Honed"];
const APPLICATIONS = ["Flooring", "Countertop", "Wall Cladding", "Parking"];

interface PageProps {
  searchParams: {
    category?: string;
    colour?: string;
    finish?: string;
    application?: string;
  };
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const { category, colour, finish, application } = searchParams;
  
  let products = [];
  let categories = [];

  try {
    const supabase = createClient();

    // 1. Fetch categories
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_published", true);
    
    categories = catData && catData.length > 0 ? catData : MOCK_CATEGORIES;

    // 2. Build Query
    let query = supabase
      .from("products")
      .select("id, name, slug, colour, finish, thickness_options, image_urls, stock_status, applications, categories!inner(id, name, slug)")
      .eq("is_published", true);

    if (category && category !== "all") {
      query = query.eq("categories.slug", category);
    }
    if (colour && colour !== "all") {
      query = query.eq("colour", colour);
    }
    if (finish && finish !== "all") {
      query = query.eq("finish", finish);
    }
    if (application && application !== "all") {
      query = query.contains("applications", [application]);
    }

    const { data: prodData, error } = await query;
    if (error) throw error;

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
        category_name: (p.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
      }));
    } else {
      // In-Memory dynamic filtering for mock data
      products = filterMockProducts(category, colour, finish, application);
    }
  } catch (err) {
    console.error("Failed to query catalog from Supabase, using mock products:", err);
    categories = MOCK_CATEGORIES;
    products = filterMockProducts(category, colour, finish, application);
  }

  // Catalogue PDF download URL hosted in Supabase Storage or placeholder
  const pdfCatalogUrl = "https://your-project.supabase.co/storage/v1/object/public/catalogues/sudhir_marbels_catalogue.pdf";

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Header Panel */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
              Curated Inventory
            </span>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
              The Slab Collections
            </h1>
            <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
              Explore our exquisite, globally imported natural stone blocks. Filter by categorization, finishes, colors, and building application requirements.
            </p>
          </div>

          {/* Download PDF Button */}
          <a
            href={pdfCatalogUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory transition-colors duration-300 font-sans text-xs font-semibold tracking-widest uppercase rounded-none shrink-0"
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Download PDF Catalogue</span>
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main client filter wrapper and grid */}
      <CollectionsClient
        categories={categories}
        products={products}
        colours={COLOURS}
        finishes={FINISHES}
        applications={APPLICATIONS}
      />
    </div>
  );
}

function filterMockProducts(
  category?: string,
  colour?: string,
  finish?: string,
  application?: string
) {
  let filtered = MOCK_PRODUCTS;

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category_slug === category);
  }
  if (colour && colour !== "all") {
    filtered = filtered.filter((p) => p.colour === colour);
  }
  if (finish && finish !== "all") {
    filtered = filtered.filter((p) => p.finish === finish);
  }
  if (application && application !== "all") {
    filtered = filtered.filter((p) => p.applications.includes(application));
  }

  return filtered;
}
