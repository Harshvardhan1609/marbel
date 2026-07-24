import { createClient } from "@/lib/supabase/server";

export interface BrandSettings {
  name: string;
  short_name: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  showroom_address: string;
  processing_address: string;
  hours: string;
  instagram_url: string;
  linkedin_url: string;
  about_story_title: string;
  about_story_p1: string;
  about_story_p2: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  allow_indexing: boolean;
  site_url: string;
}

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  name: "Arihant Marbles and Granite jodhpur ( A unit of New Art and Craft )",
  short_name: "Arihant Marbles & Granite",
  whatsapp_number: "+91 93529 95442",
  contact_phone: "+91 93529 95442",
  contact_email: "info@arihantmarbles.com",
  showroom_address: "Opp. Krishi Mandi, Basni, Jodhpur, Rajasthan, India",
  processing_address: "Industrial Area, Phase 2, Kishangarh, Rajasthan, India",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed",
  instagram_url: "https://instagram.com/arihantmarbles",
  linkedin_url: "https://linkedin.com/company/arihantmarbles",
  about_story_title: "Two Decades of Curating Nature's Masterpieces",
  about_story_p1: "Founded with a passion for architectural stone curation, Arihant Marbles and Granite has evolved from a local trading office into one of Jodhpur's and Kishangarh's premier processing plants. We believe that stone is not just a building material, but a permanent canvas of Earth's historical art.",
  about_story_p2: "Our teams consult directly with architects, builders, and structural designers globally, matching stone densities and aesthetic veining options to bespoke layouts.",
};

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  title: "Arihant Marbles & Granite — Premium Marble & Granite Curator",
  description: "Exquisite natural stone collections, marble, granite, and luxury stone processing for bespoke architectural projects in Jodhpur.",
  keywords: ["Marble", "Granite", "Natural Stone", "Luxury Interiors", "Stone Trading", "Arihant Marbles", "Jodhpur"],
  allow_indexing: true,
  site_url: "https://arihantmarbles.com",
};

export async function getBrandSettings(): Promise<BrandSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "brand_settings")
      .maybeSingle();
    
    if (error) {
      console.warn("Error fetching brand settings:", error);
      return DEFAULT_BRAND_SETTINGS;
    }
    
    if (data && data.value) {
      return { ...DEFAULT_BRAND_SETTINGS, ...(data.value as Partial<BrandSettings>) };
    }
  } catch (e) {
    console.error("Failed to load brand settings:", e);
  }
  return DEFAULT_BRAND_SETTINGS;
}

export async function getSEOSettings(): Promise<SEOSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "seo_settings")
      .maybeSingle();
    
    if (error) {
      console.warn("Error fetching SEO settings:", error);
      return DEFAULT_SEO_SETTINGS;
    }
    
    if (data && data.value) {
      return { ...DEFAULT_SEO_SETTINGS, ...(data.value as Partial<SEOSettings>) };
    }
  } catch (e) {
    console.error("Failed to load SEO settings:", e);
  }
  return DEFAULT_SEO_SETTINGS;
}
