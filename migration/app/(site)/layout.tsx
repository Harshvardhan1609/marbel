import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBrandSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getBrandSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} />
      {/* 
        Header has a height of ~80px. 
        Using pt-20 pushes content below the transparent sticky header.
      */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}

