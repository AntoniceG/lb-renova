import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { v2Button } from "@/components/v2/button-styles";
import { HomeCta } from "@/components/v2/home-cta";
import { HomeFaq } from "@/components/v2/home-faq";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { EXPERTISES } from "@/lib/v2/expertises";
import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import { PILIER_SLUGS } from "@/lib/v2/piliers";
import { getVille, publishedVilles } from "@/lib/v2/villes";

interface VillePageProps {
  params: Promise<{ ville: string }>;
}

// Seules les villes publiées existent ; tout autre segment → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedVilles().map(({ slug }) => ({ ville: slug }));
}

export async function generateMetadata({ params }: VillePageProps): Promise<Metadata> {
  const { ville: slug } = await params;
  const ville = getVille(slug);
  if (!ville) return {};
  return pageMetadata({
    title: `Rénovation à ${ville.name}`,
    description: `Rénovation complète, gros œuvre et climatisation à ${ville.name} : un seul interlocuteur du premier échange à la fin du chantier. Devis gratuit.`,
    path: `/zones/${ville.slug}`,
  });
}

export default async function VillePage({ params }: VillePageProps) {
  const { ville: slug } = await params;
  const ville = getVille(slug);
  if (!ville) notFound();

  const { contact, nav, promise } = siteConfig;
  const path = `/zones/${ville.slug}`;
  const title = `Rénovation à ${ville.name}`;
  const faq = [
    {
      question: `Intervenez-vous à ${ville.name} ?`,
      reponse: `Oui, ${ville.name} fait partie de notre secteur d'intervention. Décrivez votre projet : nous vous rappelons ${promise.callbackDelay} pour en parler avec vous.`,
    },
    {
      question: `Le devis est-il gratuit à ${ville.name} ?`,
      reponse: `Oui, le devis est gratuit, que votre chantier soit à ${ville.name} ou ailleurs dans notre secteur.`,
    },
  ];

  return (
    <V2PageShell>
      <JsonLd
        data={[
          serviceJsonLd({
            name: title,
            description: `Rénovation complète, gros œuvre et climatisation à ${ville.name}.`,
            path,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: title, path },
          ]),
        ]}
      />

      <section className="v2-relief bg-(--cream) pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="container-page">
          <nav aria-label="Fil d'Ariane" className="text-xs tracking-[0.14em] text-muted uppercase">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-navy">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="font-semibold text-navy">
                {ville.name}
              </li>
            </ol>
          </nav>

          {ville.draft && (
            <p className="mt-8 max-w-3xl border border-dashed border-red/60 bg-red/5 px-4 py-3 text-sm text-red-ink">
              Brouillon : le contenu propre à {ville.name} n&apos;est pas encore rédigé. Cette page
              n&apos;apparaît pas sur le site en ligne tant qu&apos;elle n&apos;a pas de contenu
              local réel (voir src/lib/v2/villes.ts).
            </p>
          )}

          <h1 className="mt-8 max-w-4xl font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
            Rénovation <span className="text-blue italic">à {ville.name}</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80 md:text-xl">
            {siteConfig.brand.name} intervient à {ville.name} : rénovation complète, gros œuvre,
            climatisation et les métiers qui les accompagnent. Un seul interlocuteur du premier
            échange à la fin du chantier, un devis gratuit, un rappel {promise.callbackDelay}.
          </p>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <Link href={V2_QUOTE_HREF} className={v2Button({ tone: "navy" })}>
              {nav.quoteLabel}
            </Link>
            <a
              href={telHref(contact.phone.e164)}
              className="inline-flex min-h-12 items-center gap-2.5 border border-navy/30 px-8 text-[0.8rem] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy focus-visible:outline-blue"
            >
              <Phone aria-hidden className="size-4" />
              {contact.phone.display}
            </a>
          </div>
        </div>
      </section>

      {ville.local.length > 0 && (
        <section aria-labelledby="local-title" className="bg-white py-16 md:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-ink/85">
              <h2
                id="local-title"
                className="font-v2-display text-3xl leading-[1.15] text-navy md:text-4xl"
              >
                Vos travaux à {ville.name}
              </h2>
              {ville.local.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="metiers-title" className="v2-relief bg-(--cream) py-16 md:py-24">
        <div className="container-page">
          <h2
            id="metiers-title"
            className="max-w-3xl font-v2-display text-3xl leading-[1.15] text-navy md:text-4xl"
          >
            Les métiers que nous réunissons à {ville.name}
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERTISES.map(({ slug: metier, title: label }) => (
              <li key={metier} className="border-b border-navy/15 py-3 text-lg text-navy">
                {(PILIER_SLUGS as readonly string[]).includes(metier) ? (
                  <Link href={`/${metier}`} className="underline underline-offset-4">
                    {label}
                  </Link>
                ) : (
                  label
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeFaq
        eyebrow="Questions fréquentes"
        title={
          <>
            Vos travaux à <em className="text-blue">{ville.name}</em>
          </>
        }
        items={faq}
      />
      <HomeCta />
    </V2PageShell>
  );
}
