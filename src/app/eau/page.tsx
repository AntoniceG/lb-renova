import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WaterLab } from "@/components/v2/water-lab";
import { env } from "@/config/env";
import { pageMetadata } from "@/lib/seo";

// Banc d'essai interne pour régler les vagues du hero : jamais montré dans Google, et absent du
// site publié (SITE_ENV=production ou déploiement de production Vercel). Il reste disponible en
// développement et dans les aperçus privés.
export const metadata: Metadata = pageMetadata({
  title: "Banc d'essai — l'eau du port",
  description: "Page de réglage interne.",
  path: "/eau",
  noindex: true,
});

export default function WaterLabPage() {
  if (env.isPublicDeployment) notFound();
  return <WaterLab />;
}
