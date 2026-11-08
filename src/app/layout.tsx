import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { AttributionCapture } from "@/components/quote/attribution-capture";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";
import { brandCssVars } from "@/lib/brand";
import { SHARE_IMAGE } from "@/lib/seo";
import "./globals.css";
import "./site.css";

// Polices du site (celles de bvrrenovation.fr). `next/font` les héberge lui-même : aucune
// requête vers Google au moment de la visite.
const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const text = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const { brand } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${brand.name} — ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.description,
  // Les previews et le développement ne sont jamais indexés.
  robots: env.isProduction ? undefined : { index: false, follow: false },
  openGraph: {
    siteName: brand.name,
    locale: "fr_FR",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      // Le défilement doux (globals.css) est coupé le temps d'un changement de page. Sans cette
      // marque, Next.js 16 remonte « en douceur » et, depuis le haut d'une page, la nouvelle page
      // s'ouvrait EN BAS (bouton « Devis gratuit » du hero, logo…).
      data-scroll-behavior="smooth"
      className={`${display.variable} ${text.variable}`}
      style={brandCssVars(brand.colors)}
    >
      <body>
        {/* Mémorise l'origine de la visite (campagne, référent) pour la joindre au devis. */}
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
