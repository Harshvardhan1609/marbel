import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductDetailClient from "@/components/collections/ProductDetailClient";

export const dynamic = "force-dynamic";

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

// Typed Mock Database matching collections page.tsx
const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Calacatta Oro Marble",
    slug: "calacatta-oro-marble",
    colour: "White",
    finish: "Polished",
    thickness_options: ["18mm", "20mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    ],
    stock_status: "in_stock" as const,
    category_slug: "italian-marbles",
    category_name: "Italian Marbles",
  },
  {
    id: "prod-2",
    name: "Emerald Quartzite",
    slug: "emerald-quartzite",
    colour: "Green",
    finish: "Leathered",
    thickness_options: ["20mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600",
    ],
    stock_status: "in_stock" as const,
    category_slug: "quartzite",
    category_name: "Exotic Quartzite",
  },
  {
    id: "prod-3",
    name: "Arabescato Onyx",
    slug: "arabescato-onyx",
    colour: "Pink",
    finish: "Bookmatched",
    thickness_options: ["18mm", "20mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
    ],
    stock_status: "limited" as const,
    category_slug: "onyx",
    category_name: "Luminous Onyx",
  },
  {
    id: "prod-4",
    name: "Titanium Gold Granite",
    slug: "titanium-gold-granite",
    colour: "Black",
    finish: "Satin",
    thickness_options: ["20mm", "30mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    ],
    stock_status: "in_stock" as const,
    category_slug: "indian-granites",
    category_name: "Indian Granites",
  },
  {
    id: "prod-5",
    name: "Bianco Lasa Marble",
    slug: "bianco-lasa-marble",
    colour: "White",
    finish: "Polished",
    thickness_options: ["18mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    ],
    stock_status: "in_stock" as const,
    category_slug: "italian-marbles",
    category_name: "Italian Marbles",
  },
  {
    id: "prod-6",
    name: "Crema Marfil Travertine",
    slug: "crema-marfil-travertine",
    colour: "Beige",
    finish: "Honed",
    thickness_options: ["20mm"],
    image_urls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600",
    ],
    stock_status: "sold_out" as const,
    category_slug: "travertine",
    category_name: "Classic Travertine",
  },
];

interface ProductDetailProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { slug } = params;
  let name = "Exotic Stone Slab";
  let description = "Explore our premium, hand-selected natural stone slabs.";
  let imageUrl = "";

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("name, description, image_urls")
      .eq("slug", slug)
      .single();
    if (data) {
      name = data.name;
      description = data.description || `Exquisite, globally sourced ${data.name} slab.`;
      imageUrl = data.image_urls?.[0] || "";
    }
  } catch {
    const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (mock) {
      name = mock.name;
      description = `Exquisite, globally sourced ${mock.name} slab.`;
      imageUrl = mock.image_urls[0];
    }
  }

  return {
    title: `${name} | Sudhir Marbels`,
    description,
    openGraph: {
      title: `${name} | Sudhir Marbels`,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = params;

  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const supabase = createClient();

    // 1. Fetch current product
    const { data: prodData, error: prodError } = await supabase
      .from("products")
      .select("id, name, slug, colour, finish, thickness_options, image_urls, stock_status, category_id, categories(name)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (prodError) throw prodError;

    if (prodData) {
      product = {
        id: prodData.id,
        name: prodData.name,
        slug: prodData.slug,
        colour: prodData.colour || "Mixed",
        finish: prodData.finish || "Polished",
        thickness_options: prodData.thickness_options || ["20mm"],
        image_urls: prodData.image_urls || [],
        stock_status: prodData.stock_status,
        category_name: (prodData.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
      };

      // 2. Fetch related products from category
      const { data: relData } = await supabase
        .from("products")
        .select("id, name, slug, colour, finish, thickness_options, image_urls, stock_status, categories(name)")
        .eq("category_id", prodData.category_id)
        .eq("is_published", true)
        .neq("id", prodData.id)
        .limit(4);

      if (relData && relData.length > 0) {
        relatedProducts = relData.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          colour: r.colour || "Mixed",
          finish: r.finish || "Polished",
          thickness_options: r.thickness_options || ["20mm"],
          image_urls: r.image_urls || [],
          stock_status: r.stock_status,
          category_name: (r.categories as unknown as { name: string } | null)?.name || "Exotic Slab",
        }));
      }
    }
  } catch (err) {
    console.error("Failed to query product from Supabase, using mock products:", err);
    // Find matching mock product
    const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (mock) {
      product = mock;
      relatedProducts = MOCK_PRODUCTS.filter(
        (p) => p.category_slug === mock.category_slug && p.id !== mock.id
      );
    }
  }

  // If no product is found, display 404 page
  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_urls,
    "description": `${product.name} - high-quality natural stone slab with ${product.finish} finish, available in ${product.thickness_options.join(", ")} thickness options.`,
    "category": product.category_name || "Natural Stone",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "price": "Call for Quote",
      "priceValidUntil": "2030-12-31"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
