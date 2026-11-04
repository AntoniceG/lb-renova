import type { Metadata } from "next";
import { BeforeAfterSection } from "@/components/sections/home/before-after-section";
import { FamilyStory } from "@/components/sections/home/family-story";
import { Faq } from "@/components/sections/home/faq";
import { FinalCta } from "@/components/sections/home/final-cta";
import { Guarantees } from "@/components/sections/home/guarantees";
import { Hero } from "@/components/sections/home/hero";
import { Process } from "@/components/sections/home/process";
import { ReassuranceBand } from "@/components/sections/home/reassurance";
import { RecentProjects } from "@/components/sections/home/recent-projects";
import { ReviewsStart } from "@/components/sections/home/reviews-start";
import { ServiceArea } from "@/components/sections/home/service-area";
import { Specialities } from "@/components/sections/home/specialities";
import { siteConfig } from "@/config/site.config";
import { demoProjects, showDemo } from "@/content/demo";
import { getFaq } from "@/content/home";

const { brand, area } = siteConfig;

export const metadata: Metadata = {
  title: { absolute: `Rénovation complète à ${area.baseCity} | ${brand.name}` },
  description: `Rénovation complète à ${area.baseCity} et dans un rayon de ${area.radiusKm} km : gros œuvre, climatisation, couverture. Devis gratuit.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const services = siteConfig.services.map(({ slug, title }) => ({ slug, title }));
  return (
    <>
      <Hero />
      <ReassuranceBand />
      <Specialities />
      {/* Sections visuelles masquées en production tant qu'il n'y a que du contenu de démonstration. */}
      {showDemo && <BeforeAfterSection />}
      <Process />
      {showDemo && <RecentProjects services={services} projects={demoProjects} demo />}
      <FamilyStory />
      <Guarantees />
      <ServiceArea />
      <Faq items={getFaq()} />
      <ReviewsStart />
      <FinalCta />
    </>
  );
}
