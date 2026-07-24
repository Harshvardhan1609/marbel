"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ShoppingBag,
  Mail,
  LogOut,
  FileText,
  Layers,
  Users,
  Image,
  Settings,
} from "lucide-react";
import GlobalSearch from "@/components/layout/GlobalSearch";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Listen for Ctrl+G / Cmd+G inside admin workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Skip rendering sidebar layout on the login screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout operation failed:", err);
      // Fallback redirect
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Collections", href: "/admin/collections", icon: Layers },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Team Members", href: "/admin/team", icon: Users },
    { label: "Gallery Editor", href: "/admin/gallery", icon: Image },
    { label: "Blog Editor", href: "/admin/blog", icon: FileText },
    { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#141413] text-brand-ivory overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#1A1A18] border-r border-brand-gold/15 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo block */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-lg tracking-widest text-brand-gold font-bold uppercase">
              Arihant
            </span>
            <span className="text-[9px] tracking-[0.3em] text-brand-grey uppercase font-sans -mt-1">
              Granite Control
            </span>
          </Link>

          {/* Spotlight Search Hint widget */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between p-2 border border-brand-gold/15 bg-brand-charcoal hover:border-brand-gold/40 cursor-pointer select-none transition-all group"
          >
            <span className="text-[9px] text-brand-grey group-hover:text-brand-ivory transition-colors font-sans font-semibold">
              Spotlight Search
            </span>
            <kbd className="px-1.5 py-0.5 border border-brand-gold/25 text-[8px] font-mono text-brand-gold bg-[#141413]">
              Ctrl+G
            </kbd>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5 flex flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-sans uppercase tracking-wider font-semibold border-l-2 transition-all ${
                    isActive
                      ? "border-brand-gold bg-brand-charcoal text-brand-gold"
                      : "border-transparent text-brand-grey hover:text-brand-ivory hover:bg-brand-charcoal/30"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Panel */}
        <div className="p-6 border-t border-brand-gold/10">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 border border-red-500/20 hover:border-red-500 bg-transparent hover:bg-red-950/10 text-red-400 hover:text-red-300 font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all rounded-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>


      {/* Main Content Pane */}
      <main className="flex-grow h-full overflow-y-auto bg-brand-charcoal p-8 md:p-12">
        {children}
      </main>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
