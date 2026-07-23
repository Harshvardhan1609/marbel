import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowRight } from "lucide-react";

export default function Footer() {
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
                Sudhir
              </span>
              <span className="text-[10px] tracking-[0.3em] text-brand-grey uppercase font-sans -mt-1">
                Marbels
              </span>
            </Link>
            <p className="text-sm text-brand-grey font-sans leading-relaxed">
              Curators of premium natural stones, sourcing unique marble, granite, and exotic slabs globally to redefine contemporary luxury spaces.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
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
                <Link href="/projects" className="hover:text-brand-gold transition-colors">
                  Projects
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
                  <span className="text-brand-grey text-xs">VKI Area, Jaipur, Rajasthan, India</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-ivory block">Processing Unit</span>
                  <span className="text-brand-grey text-xs">Industrial Area, Kishangarh, Rajasthan, India</span>
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
                <span className="text-brand-grey">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span className="text-brand-grey">info@sudhirmarbels.com</span>
              </li>
              <li className="text-xs text-brand-grey leading-relaxed pt-2">
                Showroom Hours:<br />
                Mon - Sat: 9:00 AM - 7:00 PM<br />
                Sunday: Closed
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-brand-grey font-sans gap-4">
          <p>© {new Date().getFullYear()} Sudhir Marbels. All rights reserved.</p>
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
