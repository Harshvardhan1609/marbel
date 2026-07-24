"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Check, Loader2, Settings, Globe, Shield, MessageSquare, Info, Sliders } from "lucide-react";
import { BrandSettings, SEOSettings } from "@/lib/settings";

interface SettingsAdminClientProps {
  initialBrandSettings: BrandSettings;
  initialSEOSettings: SEOSettings;
  initialHeroSlides: Array<{ title: string; subtitle: string }>;
  initialStats: Array<{ value: string; label: string }>;
}

export default function SettingsAdminClient({
  initialBrandSettings,
  initialSEOSettings,
  initialHeroSlides,
  initialStats,
}: SettingsAdminClientProps) {
  const [activeTab, setActiveTab] = useState<"brand" | "seo" | "address" | "story" | "hero">("brand");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [brand, setBrand] = useState<BrandSettings>(initialBrandSettings);
  const [seo, setSeo] = useState<SEOSettings>(initialSEOSettings);
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides);
  const [stats, setStats] = useState(initialStats);
  const [seoKeywordsText, setSeoKeywordsText] = useState(initialSEOSettings.keywords.join(", "));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const supabase = createClient();

      // Process keywords
      const keywordsArray = seoKeywordsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedSEO = { ...seo, keywords: keywordsArray };

      const payloads = [
        { key: "brand_settings", value: brand },
        { key: "seo_settings", value: updatedSEO },
        { key: "hero_slides", value: heroSlides },
        { key: "stats", value: stats },
      ];

      for (const payload of payloads) {
        const { error } = await supabase
          .from("site_settings")
          .upsert([payload], { onConflict: "key" });

        if (error) throw error;
      }

      setSeo(updatedSEO);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Failed to save settings: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroTitleChange = (idx: number, val: string) => {
    const updated = [...heroSlides];
    updated[idx].title = val;
    setHeroSlides(updated);
  };

  const handleHeroSubtitleChange = (idx: number, val: string) => {
    const updated = [...heroSlides];
    updated[idx].subtitle = val;
    setHeroSlides(updated);
  };

  const handleStatValueChange = (idx: number, val: string) => {
    const updated = [...stats];
    updated[idx].value = val;
    setStats(updated);
  };

  const handleStatLabelChange = (idx: number, val: string) => {
    const updated = [...stats];
    updated[idx].label = val;
    setStats(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-brand-ivory tracking-wide flex items-center gap-2">
          <Settings className="h-7 w-7 text-brand-gold" />
          <span>Site Settings Control</span>
        </h1>
        <p className="text-xs text-brand-grey font-sans">
          Configure branding, dynamic SEO metadata, Jodhpur locations, and homepage text sliders.
        </p>
      </div>

      <div className="h-[1px] w-full bg-brand-gold/15" />

      {success && (
        <div className="p-4 bg-emerald-950/45 border border-emerald-500/20 text-emerald-400 text-xs font-sans flex items-center gap-2">
          <Check className="h-4.5 w-4.5" />
          <span>Website configurations saved successfully. Public pages will reflect updates instantly!</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-brand-gold/10 overflow-x-auto select-none gap-2">
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-5 py-3 border-b-2 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "brand"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-grey hover:text-brand-ivory"
          }`}
        >
          <Info className="h-4 w-4" />
          <span>Brand Identity</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`px-5 py-3 border-b-2 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "seo"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-grey hover:text-brand-ivory"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>SEO & Canonical</span>
        </button>

        <button
          onClick={() => setActiveTab("address")}
          className={`px-5 py-3 border-b-2 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "address"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-grey hover:text-brand-ivory"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Office & Hours</span>
        </button>

        <button
          onClick={() => setActiveTab("story")}
          className={`px-5 py-3 border-b-2 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "story"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-grey hover:text-brand-ivory"
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Story & Legacy</span>
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3 border-b-2 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "hero"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-grey hover:text-brand-ivory"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Hero Slides & Stats</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* TAB 1: BRAND IDENTITY */}
        {activeTab === "brand" && (
          <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
              1. Brand Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Company Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  Full Company Name
                </label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Arihant Marbles and Granite jodhpur..."
                />
              </div>

              {/* Short Brand Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  Short Brand Name (for Headers/Footers)
                </label>
                <input
                  type="text"
                  value={brand.short_name}
                  onChange={(e) => setBrand({ ...brand, short_name: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Arihant Marbles"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-[#25D366]" />
                  <span>WhatsApp Mobile (with Country Code)</span>
                </label>
                <input
                  type="text"
                  value={brand.whatsapp_number}
                  onChange={(e) => setBrand({ ...brand, whatsapp_number: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="+91 93529 95442"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  Business Phone
                </label>
                <input
                  type="text"
                  value={brand.contact_phone}
                  onChange={(e) => setBrand({ ...brand, contact_phone: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="+91 93529 95442"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={brand.contact_email}
                  onChange={(e) => setBrand({ ...brand, contact_email: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="info@arihantmarbles.com"
                />
              </div>

              {/* Instagram URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  Instagram Profile Link
                </label>
                <input
                  type="text"
                  value={brand.instagram_url}
                  onChange={(e) => setBrand({ ...brand, instagram_url: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans">
                  LinkedIn Company Profile Link
                </label>
                <input
                  type="text"
                  value={brand.linkedin_url}
                  onChange={(e) => setBrand({ ...brand, linkedin_url: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEO CONFIG */}
        {activeTab === "seo" && (
          <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
              2. Search Engine Optimization & Indexing (Backend Controlled)
            </h3>

            <div className="space-y-5">
              {/* Site Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Site Canonical Base URL (sitemap & robots)
                </label>
                <input
                  type="text"
                  value={seo.site_url}
                  onChange={(e) => setSeo({ ...seo, site_url: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="https://arihantmarbles.com"
                />
              </div>

              {/* Meta Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Search Engine Meta Title
                </label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Arihant Marbles & Granite — Premium Stone Curator"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Meta Description
                </label>
                <textarea
                  rows={4}
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none resize-none"
                  placeholder="Write a summary describing company products and expertise for search result listings..."
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={seoKeywordsText}
                  onChange={(e) => setSeoKeywordsText(e.target.value)}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Marble, Granite, Basni showroom, Jodhpur stone..."
                />
              </div>

              {/* Google Indexing Toggle */}
              <div className="flex items-center gap-3 pt-3">
                <input
                  type="checkbox"
                  id="allow_indexing"
                  checked={seo.allow_indexing}
                  onChange={(e) => setSeo({ ...seo, allow_indexing: e.target.checked })}
                  className="h-4.5 w-4.5 accent-brand-gold bg-brand-charcoal border-brand-gold/20 focus:ring-0 cursor-pointer rounded-none"
                />
                <label htmlFor="allow_indexing" className="text-xs text-brand-ivory font-sans cursor-pointer select-none">
                  Allow search engines indexing (generate allow directives in robots.txt)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOCATIONS & HOURS */}
        {activeTab === "address" && (
          <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
              3. Locations & Opening Hours
            </h3>

            <div className="space-y-5">
              {/* Showroom Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Jodhpur Showroom Address
                </label>
                <input
                  type="text"
                  value={brand.showroom_address}
                  onChange={(e) => setBrand({ ...brand, showroom_address: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Opp. Krishi Mandi, Basni, Jodhpur, Rajasthan, India"
                />
              </div>

              {/* Processing plant address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Processing Unit Address
                </label>
                <input
                  type="text"
                  value={brand.processing_address}
                  onChange={(e) => setBrand({ ...brand, processing_address: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Industrial Area, Phase 2, Kishangarh, Rajasthan, India"
                />
              </div>

              {/* Showroom Opening Hours */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Showroom Operational Hours (Line-by-line)
                </label>
                <textarea
                  rows={3}
                  value={brand.hours}
                  onChange={(e) => setBrand({ ...brand, hours: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none resize-none font-sans"
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM&#10;Sunday: Closed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORY & LEGACY */}
        {activeTab === "story" && (
          <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
              4. Story & About Page Text
            </h3>

            <div className="space-y-5">
              {/* About story title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  Story Section Headline
                </label>
                <input
                  type="text"
                  value={brand.about_story_title}
                  onChange={(e) => setBrand({ ...brand, about_story_title: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  placeholder="Two Decades of Curating Nature's Masterpieces"
                />
              </div>

              {/* Story Paragraph 1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  About Story - Paragraph 1
                </label>
                <textarea
                  rows={5}
                  value={brand.about_story_p1}
                  onChange={(e) => setBrand({ ...brand, about_story_p1: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none resize-none"
                />
              </div>

              {/* Story Paragraph 2 */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-sans block">
                  About Story - Paragraph 2
                </label>
                <textarea
                  rows={5}
                  value={brand.about_story_p2}
                  onChange={(e) => setBrand({ ...brand, about_story_p2: e.target.value })}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HERO & STATS */}
        {activeTab === "hero" && (
          <div className="space-y-8">
            {/* Hero Slides Editor */}
            <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
                  5.1 Hero Slides Headlines
                </h3>
                <p className="text-[11px] text-brand-grey font-sans">
                  Change the text overlaying the home page slideshow slides.
                </p>
              </div>

              <div className="space-y-6">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="space-y-4 border-l-2 border-brand-gold/30 pl-4">
                    <h4 className="text-[11px] uppercase tracking-wider text-brand-gold font-bold font-sans">
                      Slide {idx + 1}
                    </h4>

                    {/* Headline */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleHeroTitleChange(idx, e.target.value)}
                        className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                      />
                    </div>

                    {/* Subline */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                        Headline Sub-line / Description
                      </label>
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => handleHeroSubtitleChange(idx, e.target.value)}
                        className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Editor */}
            <div className="bg-[#1A1A18] border border-brand-gold/10 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
                  5.2 Trust Counter Statistics
                </h3>
                <p className="text-[11px] text-brand-grey font-sans">
                  Modify statistics counters displayed on the landing strip.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-3 border border-brand-gold/10 p-4 bg-brand-charcoal/20">
                    <h4 className="text-[10px] uppercase tracking-widest text-brand-gold font-sans font-bold">
                      Stat Card {idx + 1}
                    </h4>

                    {/* Value */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-brand-grey block font-sans">
                        Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatValueChange(idx, e.target.value)}
                        className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3 py-1.5 text-xs text-brand-ivory focus:outline-none rounded-none text-center font-serif font-bold text-brand-gold"
                      />
                    </div>

                    {/* Label */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-brand-grey block font-sans">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatLabelChange(idx, e.target.value)}
                        className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3 py-1.5 text-xs text-brand-ivory focus:outline-none rounded-none text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-gold text-brand-charcoal font-bold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory hover:text-brand-charcoal transition-colors flex items-center justify-center gap-2 rounded-none shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Saving website settings...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Configurations</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
