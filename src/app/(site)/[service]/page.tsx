import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/sections/home/faq";
import { FinalCta } from "@/components/sections/home/final-cta";
import { Process } from "@/components/sections/home/process";
import {
  OtherServices,
  ServiceBenefits,
  ServiceCase,
  ServiceGuides,
  ServiceHero,
  ServiceSolutions,
} from "@/components/sections/service/service-sections";
import { siteConfig } from "@/config/site.config";
import { showDemo } from "@/content/demo";
import { getServiceContent } from "@/content/services";

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

// Seules les spécialités de la config sont servies ; tout autre segment racine → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return siteConfig.services.map(({ slug }) => ({ service: slug }));
}

function findPage(slug: string) {
  const service = siteConfig.services.find((s) => s.slug === slug);
  const content = getServiceContent(slug);
  return service && content ? { service, content } : undefined;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  return {
    title: page.content.metaTitle,
    description: page.content.metaDescription,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();
  const { service, content } = page;

  return (
    <>
      <ServiceHero service={service} lead={content.lead} />
      <ServiceBenefits benefits={content.benefits} />
      <ServiceSolutions
        title={`Nos prestations en ${service.title.toLowerCase()}`}
        solutions={content.solutions}
      />
      <ServiceGuides guides={content.guides} />
      {showDemo && <ServiceCase title={service.title} />}
      <Process steps={content.process} title={`${service.title} : de la visite à la réception`} />
      <Faq items={content.faq} title={`Vos questions sur ${service.title.toLowerCase()}`} />
      <OtherServices currentSlug={service.slug} />
      <FinalCta
        title={`Un projet de ${service.title.toLowerCase()} à ${siteConfig.area.baseCity} ?`}
      />
    </>
  );
}
