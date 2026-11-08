import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { serviceJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { HomeCta } from "@/components/v2/home-cta";
import { HomeFaq } from "@/components/v2/home-faq";
import {
  PilierAutres,
  PilierBenefits,
  PilierGuides,
  PilierHero,
  PilierMarques,
  PilierPhotos,
  PilierProcess,
  PilierSolutions,
} from "@/components/v2/pilier-sections";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { getPilier, MARQUES, PILIER_SLUGS } from "@/lib/v2/piliers";
import { getAlbum } from "@/lib/v2/realisations";

interface PilierPageProps {
  params: Promise<{ service: string }>;
}

// Seuls les trois métiers prioritaires ont une page dédiée ; tout autre segment → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PILIER_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({ params }: PilierPageProps): Promise<Metadata> {
  const { service } = await params;
  const pilier = getPilier(service);
  if (!pilier) return {};
  return pageMetadata({
    title: pilier.metaTitle,
    description: pilier.metaDescription,
    path: `/${pilier.slug}`,
  });
}

export default async function PilierPage({ params }: PilierPageProps) {
  const { service } = await params;
  const pilier = getPilier(service);
  if (!pilier) notFound();

  const { content, title } = pilier;
  const album = getAlbum(pilier.slug);
  const marques = MARQUES[pilier.slug];
  const name = title.toLowerCase();

  return (
    <V2PageShell>
      <JsonLd
        data={[
          serviceJsonLd({
            name: title,
            description: pilier.metaDescription,
            path: `/${pilier.slug}`,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: title, path: `/${pilier.slug}` },
          ]),
        ]}
      />
      <PilierHero pilier={pilier} />
      <PilierBenefits benefits={content.benefits} />
      <PilierSolutions title={`Nos prestations en ${name}`} solutions={content.solutions} />
      {marques && <PilierMarques marques={marques} />}
      {album && <PilierPhotos album={album} />}
      <PilierGuides guides={content.guides} />
      <PilierProcess title={`${title} : de la visite à la réception`} steps={content.process} />
      <HomeFaq
        eyebrow="Questions fréquentes"
        title={
          <>
            Vos questions sur <em className="text-blue">{name}</em>
          </>
        }
        items={content.faq.map(({ question, answer }) => ({ question, reponse: answer }))}
      />
      <PilierAutres currentSlug={pilier.slug} />
      <HomeCta />
    </V2PageShell>
  );
}
