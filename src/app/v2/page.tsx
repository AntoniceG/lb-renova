import type { Metadata } from "next";
import { HomeAssurances } from "@/components/v2/home-assurances";
import { HomeExpertises } from "@/components/v2/home-expertises";
import { HomeHero } from "@/components/v2/home-hero";
import { HomeHistoire } from "@/components/v2/home-histoire";
import { HomeIntro } from "@/components/v2/home-intro";
import { V2Header } from "@/components/v2/v2-header";

// Page de travail de la refonte : jamais indexée tant que le client n'a pas validé la migration.
export const metadata: Metadata = {
  title: "Accueil — refonte V2",
  robots: { index: false, follow: false },
};

export default function V2HomePage() {
  return (
    <>
      <V2Header />
      <main>
        <HomeHero />
        <HomeAssurances />
        <HomeIntro />
        <HomeExpertises />
        <HomeHistoire />
      </main>
    </>
  );
}
