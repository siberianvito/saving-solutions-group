import type { MetadataRoute } from "next";
import { PRODUCTS, SITE } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || SITE.url;
  const pages = ["", "/quote", "/client-center", "/about", "/alliance", "/contact", "/agents"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/insurance/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
