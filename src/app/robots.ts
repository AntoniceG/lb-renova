import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  // Aperçus et développement : rien n'est indexé.
  if (!env.isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/lp/", "/merci", "/eau"] },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
