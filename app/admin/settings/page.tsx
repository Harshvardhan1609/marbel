import { createClient } from "@/lib/supabase/server";
import SettingsAdminClient from "@/components/admin/SettingsAdminClient";
import { DEFAULT_BRAND_SETTINGS, DEFAULT_SEO_SETTINGS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let brandSettings = DEFAULT_BRAND_SETTINGS;
  let seoSettings = DEFAULT_SEO_SETTINGS;
  let heroSlides = [];
  let stats = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_settings").select("*");

    if (!error && data) {
      const brand = data.find((s) => s.key === "brand_settings");
      if (brand && brand.value) {
        brandSettings = { ...DEFAULT_BRAND_SETTINGS, ...brand.value };
      }

      const seo = data.find((s) => s.key === "seo_settings");
      if (seo && seo.value) {
        seoSettings = { ...DEFAULT_SEO_SETTINGS, ...seo.value };
      }

      const slides = data.find((s) => s.key === "hero_slides");
      if (slides && slides.value) {
        heroSlides = slides.value;
      } else {
        heroSlides = [
          {
            title: "Timeless Stone. Modern Spaces.",
            subtitle: "Exquisite hand-selected marble and granites tailored to your design specifications.",
          },
          {
            title: "Geological Craft. Architectural Art.",
            subtitle: "Direct-from-source exotics curated from Italian, Brazilian, and Indian quarries.",
          },
        ];
      }

      const statVal = data.find((s) => s.key === "stats");
      if (statVal && statVal.value) {
        stats = statVal.value;
      } else {
        stats = [
          { value: "20+", label: "Years Experience" },
          { value: "150+", label: "Stone Varieties" },
          { value: "500+", label: "Projects Sourced" },
        ];
      }
    }
  } catch (err) {
    console.error("Failed to query settings in admin:", err);
  }

  return (
    <SettingsAdminClient
      initialBrandSettings={brandSettings}
      initialSEOSettings={seoSettings}
      initialHeroSlides={heroSlides}
      initialStats={stats}
    />
  );
}
