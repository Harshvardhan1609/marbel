import { MetadataRoute } from "next";
import { getSEOSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSEOSettings();
  const baseUrl = seo.site_url || "https://arihantmarbles.com";

  return {
    rules: {
      userAgent: "*",
      allow: seo.allow_indexing ? "/" : "",
      disallow: seo.allow_indexing ? "/admin/" : "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

