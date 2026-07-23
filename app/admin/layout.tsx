"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, ShoppingBag, Mail, FileEdit, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
    { label: "Content Editor", href: "/admin/content", icon: FileEdit },
  ];

  return (
    <div className="flex h-screen bg-[#141413] text-brand-ivory overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#1A1A18] border-r border-brand-gold/15 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo block */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-lg tracking-widest text-brand-gold font-bold uppercase">
              Sudhir
            </span>
            <span className="text-[9px] tracking-[0.3em] text-brand-grey uppercase font-sans -mt-1">
              Marbels Control
            </span>
          </Link>

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
    </div>
  );
}
