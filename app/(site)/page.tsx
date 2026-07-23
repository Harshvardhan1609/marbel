import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import StatsBar from "@/components/home/StatsBar";
import NewArrivalsRail from "@/components/home/NewArrivalsRail";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import PartnerMarquee from "@/components/home/PartnerMarquee";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { ScrollReveal } from "@/components/motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-brand-ivory text-brand-charcoal overflow-x-hidden">
      {/* 
        Hero Carousel (animates on mount - above the fold, 
        so we do not wrap in scroll reveal to prevent initial blank flash) 
      */}
      <HeroCarousel />

      {/* Trust Strip sitting directly underneath hero */}
      <TrustStrip />

      {/* Category Grid Section */}
      <ScrollReveal yOffset={35}>
        <CategoryGrid />
      </ScrollReveal>

      {/* Stats counter bar */}
      <ScrollReveal yOffset={30}>
        <StatsBar />
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
      <WhatsAppButton />
    </div>
  );
}
