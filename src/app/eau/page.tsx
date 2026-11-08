import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WaterLab } from "@/components/v2/water-lab";
import { env } from "@/config/env";
import { pageMetadata } from "@/lib/seo";

// Banc d'essai interne pour régler les vagues du hero : jamais montré dans Google, et absent du
// site en ligne (SITE_ENV=production). Il reste disponible en développement et en aperçu.
export const metadata: Metadata = pageMetadata({
  title: "Banc d'essai — l'eau du port",
  description: "Page de réglage interne.",
  path: "/eau",
  noindex: true,
});

export default function WaterLabPage() {
  if (env.isProduction) notFound();
  return <WaterLab />;
}
