import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import StatsBar from "@/components/home/StatsBar";
import NewArrivalsRail from "@/components/home/NewArrivalsRail";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import PartnerMarquee from "@/components/home/PartnerMarquee";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { ScrollReveal } from "@/components/motion";
import { createClient } from "@/lib/supabase/server";
import { getBrandSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  colours: string[];
}

export default async function Home() {
  let heroSlides = null;
  let stats = null;
  let categoryOrder = null;
  let categories: DBCategory[] = [];
  let brandSettings = null;

  try {
    const supabase = createClient();
    brandSettings = await getBrandSettings();

    // 1. Fetch site settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("key, value");

    if (settingsData) {
      const heroSlidesSetting = settingsData.find((s) => s.key === "hero_slides");
      if (heroSlidesSetting && Array.isArray(heroSlidesSetting.value)) {
        heroSlides = heroSlidesSetting.value;
      }
      const statsSetting = settingsData.find((s) => s.key === "stats");
      if (statsSetting && Array.isArray(statsSetting.value)) {
        stats = statsSetting.value;
      }
      const categoryOrderSetting = settingsData.find((s) => s.key === "featured_categories_order");
      if (categoryOrderSetting && Array.isArray(categoryOrderSetting.value)) {
        categoryOrder = categoryOrderSetting.value;
      }
    }

    // 2. Fetch categories
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url, colours")
      .eq("is_published", true);

    if (catData) {
      categories = catData;
    }
  } catch (e) {
    console.error("Failed to load homepage data from Supabase:", e);
  }

  return (
    <div className="relative min-h-screen bg-brand-ivory text-brand-charcoal overflow-x-hidden">
      {/* 
        Hero Carousel (animates on mount - above the fold, 
        so we do not wrap in scroll reveal to prevent initial blank flash) 
      */}
      <HeroCarousel customSlides={heroSlides} settings={brandSettings || undefined} />

      {/* Trust Strip sitting directly underneath hero */}
      <TrustStrip />

      {/* Category Grid Section */}
      <ScrollReveal yOffset={35}>
        <CategoryGrid categories={categories} customOrder={categoryOrder} />
      </ScrollReveal>

      {/* Stats counter bar */}
      <ScrollReveal yOffset={30}>
        <StatsBar customStats={stats} />
      </ScrollReveal>

      {/* Horizontal scrolling New arrivals rail */}
      <ScrollReveal yOffset={35}>
        <NewArrivalsRail />
      </ScrollReveal>

      {/* Testimonials section */}
      <ScrollReveal yOffset={30}>
        <TestimonialsCarousel />
      </ScrollReveal>

      {/* Infinite scrolling Partner logo marquee */}
      <ScrollReveal yOffset={25}>
        <PartnerMarquee />
      </ScrollReveal>

      {/* Sticky WhatsApp Chat Button */}
      <WhatsAppButton phone={brandSettings?.whatsapp_number} name={brandSettings?.short_name} />
    </div>
  );
}

