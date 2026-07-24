import { MetadataRoute } from "next";
import { getSEOSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSEOSettings();
  const baseUrl = seo.site_url || "https://arihantmarbles.com";

  const routes = [
    "",
    "/about",
    "/collections",
    "/projects",
    "/blog",
    "/contact",
    "/visualizer",
    "/gallery",
    "/team",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}

