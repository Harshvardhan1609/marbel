import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getSEOSettings } from "@/lib/settings";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOSettings();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(seo.site_url || "https://arihantmarbles.com"),
    robots: {
      index: seo.allow_indexing,
      follow: seo.allow_indexing,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

