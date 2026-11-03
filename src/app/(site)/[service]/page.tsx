import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/components/ui/icons";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

// Seules les spécialités de la config sont servies ; tout autre segment racine → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return siteConfig.services.map(({ slug }) => ({ service: slug }));
}

function findService(slug: string) {
  return siteConfig.services.find((s) => s.slug === slug);
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return {
    title: `${service.title} à ${siteConfig.area.baseCity}`,
    description: service.intro,
    alternates: { canonical: `/${service.slug}` },
  };
}

/** Squelette de page métier : le contenu éditorial complet arrive en phase 4. */
export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const Icon = ICONS[service.iconKey];
  const { nav, contact } = siteConfig;

  return (
    <section className="bg-navy text-white">
      <div className="container-page py-16 md:py-24">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-white/70">
          <Link href="/" className="hover:text-white">
            Accueil
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <span aria-current="page" className="text-white">
            {service.title}
          </span>
        </nav>
        <span className="mt-8 inline-flex size-14 items-center justify-center rounded-2xl bg-white/10">
          <Icon aria-hidden className="size-7" />
        </span>
        <h1 className="mt-5 max-w-3xl text-display">{service.title}</h1>
        <p className="mt-6 max-w-xl text-lg text-white/80">{service.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="xl" asChild>
            <Link href={nav.quoteHref}>{nav.quoteLabel}</Link>
          </Button>
          <Button variant="ghostLight" size="xl" asChild>
            <a href={telHref(contact.phone.e164)}>{contact.phone.display}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
