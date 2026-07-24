import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { BrandSettings } from "@/lib/settings";

interface FooterProps {
  settings?: BrandSettings;
}

export default function Footer({ settings }: FooterProps) {
  const shortName = settings?.short_name || "Arihant Marbles & Granite";
  const nameParts = shortName.split(" ");
  const firstWord = nameParts[0] || "Arihant";
  const restOfName = nameParts.slice(1).join(" ") || "Marbles & Granite";

  const email = settings?.contact_email || "info@arihantmarbles.com";
  const phone = settings?.contact_phone || "+91 93529 95442";
  const hours = settings?.hours || "Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed";
  const instagram = settings?.instagram_url || "https://instagram.com/arihantmarbles";
  const linkedin = settings?.linkedin_url || "https://linkedin.com/company/arihantmarbles";

  return (
    <footer className="bg-brand-charcoal border-t border-brand-gold/10 text-brand-ivory/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="border-b border-brand-gold/10 pb-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-md">
            <h3 className="font-serif text-2xl text-brand-ivory mb-2 tracking-wide">
              Subscribe to Our Catalogue
            </h3>
            <p className="text-sm text-brand-grey font-sans">
              Stay informed about our latest stone arrivals, premium collections, and curated architectural projects.
            </p>
          </div>
          <form className="w-full md:w-auto flex items-center border border-brand-gold/20 hover:border-brand-gold transition-colors duration-300">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent text-sm text-brand-ivory px-4 py-3 focus:outline-none w-full md:w-64 placeholder-brand-grey/50"
              required
            />
            <button
              type="submit"
              className="bg-brand-gold text-brand-charcoal p-3 hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 flex items-center justify-center"
              aria-label="Subscribe"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-gold/5">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-xl tracking-widest text-brand-gold font-bold uppercase">
                {firstWord}
              </span>
              <span className="text-[10px] tracking-[0.3em] text-brand-grey uppercase font-sans -mt-1">
                {restOfName}
              </span>
            </Link>
            <p className="text-sm text-brand-grey font-sans leading-relaxed">
              Curators of premium natural stones, sourcing unique marble, granite, and exotic slabs globally to redefine contemporary luxury spaces.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-brand-ivory mb-4 tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-gold transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-gold transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-gold transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-brand-gold transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-serif text-lg text-brand-ivory mb-4 tracking-wider">
              Locations
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-ivory block">Main Showroom</span>
                  <span className="text-brand-grey text-xs">
                    {settings?.showroom_address || "Opp. Krishi Mandi, Basni, Jodhpur, Rajasthan, India"}
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-ivory block">Processing Unit</span>
                  <span className="text-brand-grey text-xs">
                    {settings?.processing_address || "Industrial Area, Phase 2, Kishangarh, Rajasthan, India"}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg text-brand-ivory mb-4 tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-gold" />
                <span className="text-brand-grey">{phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span className="text-brand-grey">{email}</span>
              </li>
              <li className="text-xs text-brand-grey leading-relaxed pt-2 whitespace-pre-line">
                Showroom Hours:{"\n"}
                {hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-brand-grey font-sans gap-4">
          <p>© {new Date().getFullYear()} {settings?.name || "Arihant Marbles and Granite jodhpur"}. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

