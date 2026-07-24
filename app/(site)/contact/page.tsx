import { getBrandSettings } from "@/lib/settings";
import ContactClient from "@/components/contact/ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getBrandSettings();

  const shortName = settings.short_name || "Arihant Marbles & Granite";
  const whatsappNumber = settings.whatsapp_number.replace(/\D/g, "");
  const formattedPhone = whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber;

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `Hello ${shortName}, I am seeking a price quotation and slab catalog consult.`
  )}`;

  const locations = [
    {
      name: "Main Showroom",
      address: settings.showroom_address || "Opp. Krishi Mandi, Basni, Jodhpur, Rajasthan, India",
      phone: settings.contact_phone || "+91 93529 95442",
      email: settings.contact_email || "info@arihantmarbles.com",
      hours: "Mon - Sat: 9 AM - 7 PM",
      mapLabel: "Main Showroom Map View",
    },
    {
      name: "Processing Unit",
      address: settings.processing_address || "Industrial Area, Phase 2, Kishangarh, Rajasthan, India",
      phone: settings.contact_phone || "+91 93529 95442",
      email: settings.contact_email || "info@arihantmarbles.com",
      hours: "Mon - Sat: 8 AM - 6 PM",
      mapLabel: "Processing Facility Map View",
    },
  ];

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Page Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Contact Our Curators
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Request price lists, physical slab inspection visits, or layout visualization consultations at {shortName}.
          </p>
        </div>
      </div>

      <ContactClient locations={locations} whatsappUrl={whatsappUrl} brandName={shortName} />
    </div>
  );
}
