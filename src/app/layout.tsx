import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import type { ReactNode } from "react";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";
import { brandCssVars } from "@/lib/brand";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const text = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const { brand } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${brand.name} — ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.description,
  // Les previews et le développement ne sont jamais indexés.
  robots: env.isProduction ? undefined : { index: false, follow: false },
  openGraph: { siteName: brand.name, locale: "fr_FR", type: "website" },
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
      <body>{children}</body>
    </html>
  );
}
