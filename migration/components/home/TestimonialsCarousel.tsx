import { createClient } from "@/lib/supabase/server";
import TestimonialsCarouselClient from "./TestimonialsCarouselClient";

// Typed Mock Fallbacks in case database is empty or connection fails
const MOCK_TESTIMONIALS = [
  {
    id: "mock-1",
    author_name: "Rajesh Malhotra",
    author_title: "Principal Architect",
    company: "Malhotra & Partners",
    quote: "Sudhir Marbels curated the entire Calacatta volume for our penthouse project in South Delhi. The bookmatching was absolutely flawless, and the structural density exceeded our engineering standards.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120",
    video_thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "mock-2",
    author_name: "Priya Sharma",
    author_title: "Design Director",
    company: "Atelier Sharma",
    quote: "Finding rare, leathered quartzite slab volumes for commercial lobbies is incredibly challenging. Sudhir Marbels sourced and line-polished 40 matching Emerald Quartzite slabs in record time.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120",
  },
  {
    id: "mock-3",
    author_name: "Vikram Goel",
    author_title: "Managing Director",
    company: "Vanguard Builders",
    quote: "We require high-volume premium granites for luxury cladding. Sudhir Marbels has been our trusted stone trading partner for over a decade. Their processing plant matches international standards.",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120",
  },
];

export default async function TestimonialsCarousel() {
  let testimonials = [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, author_name, author_title, company, quote, avatar_url, is_published")
      .eq("is_published", true)
      .limit(5);

    if (error) throw error;
    if (data && data.length > 0) {
      testimonials = data.map((t) => ({
        id: t.id,
        author_name: t.author_name,
        author_title: t.author_title || "Client",
        company: t.company || "Architect",
        quote: t.quote,
        avatar_url: t.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120",
        // We'll append mock video data for Rajesh Malhotra (or the first index) for UI demonstration
        video_thumbnail: t.author_name.includes("Rajesh")
          ? "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600"
          : undefined,
        video_url: t.author_name.includes("Rajesh")
          ? "https://www.w3schools.com/html/mov_bbb.mp4"
          : undefined,
      }));
    } else {
      testimonials = MOCK_TESTIMONIALS;
    }
  } catch (error) {
    console.error("Failed to fetch testimonials from Supabase, using mock fallback data:", error);
    testimonials = MOCK_TESTIMONIALS;
  }

  return <TestimonialsCarouselClient testimonials={testimonials} />;
}
