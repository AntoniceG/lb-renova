import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { HomeAssurances } from "@/components/v2/home-assurances";
import { HomeAvis } from "@/components/v2/home-avis";
import { HomeCta } from "@/components/v2/home-cta";
import { HomeExpertises } from "@/components/v2/home-expertises";
import { HomeFaq } from "@/components/v2/home-faq";
import { HomeHero } from "@/components/v2/home-hero";
import { HomeHistoire } from "@/components/v2/home-histoire";
import { HomeIntro } from "@/components/v2/home-intro";
import { HomeZone } from "@/components/v2/home-zone";
import { V2Footer } from "@/components/v2/v2-footer";
import { V2Header } from "@/components/v2/v2-header";
import { siteConfig } from "@/config/site.config";
import { businessJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

const { brand } = siteConfig;

export const metadata: Metadata = pageMetadata({
  // Différent du titre de la page « Rénovation complète » (deux pages ne doivent pas se concurrencer).
  title: `Entreprise de rénovation à Marseille et Aix | ${brand.name}`,
  absoluteTitle: true,
  description: brand.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[businessJsonLd(), websiteJsonLd()]} />
      <V2Header />
      <main>
        <HomeHero />
        <HomeAssurances />
        <HomeIntro />
        <HomeExpertises />
        <HomeHistoire />
        <HomeAvis />
        <HomeZone />
        <HomeFaq />
        <HomeCta />
      </main>
      <V2Footer />
    </>
  );
}
