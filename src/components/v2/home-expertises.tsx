import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import { EXPERTISES, EXPERTISES_COPY } from "@/lib/v2/expertises";
import { isPilier } from "@/lib/v2/piliers";
import { hasAlbum } from "@/lib/v2/realisations";
import { v2Button } from "./button-styles";

/** Décale l'apparition des cartes d'une même grille (voir `.reveal` dans globals.css). */
const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * Lien du badge : la page dédiée du métier si elle existe (rénovation complète, gros œuvre,
 * climatisation), sinon l'album photo s'il a des photos ; sinon un simple bloc, sans lien.
 */
function Wrap({
  slug,
  title,
  className,
  children,
}: {
  slug: string;
  title: string;
  className: string;
  children: ReactNode;
}) {
  if (isPilier(slug)) {
    return (
      <Link
        href={`/v2/${slug}`}
        aria-label={`${title} : en savoir plus`}
        className={`${className} focus-visible:outline-blue`}
      >
        {children}
      </Link>
    );
  }
  if (!hasAlbum(slug)) return <div className={className}>{children}</div>;
  return (
    <Link
      href={`/v2/realisations/${slug}`}
      aria-label={`${title} : voir les réalisations`}
      className={`${className} focus-visible:outline-blue`}
    >
      {children}
    </Link>
  );
}

/** « Nos expertises » : trois grandes cartes pour les métiers prioritaires, puis les autres en tuiles. */
export function HomeExpertises() {
  const { nav, promise } = siteConfig;
  const featured = EXPERTISES.filter((expertise) => expertise.featured);
  const others = EXPERTISES.filter((expertise) => !expertise.featured);

  return (
    <section id="expertises" aria-labelledby="expertises-title" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            {EXPERTISES_COPY.eyebrow}
          </p>
          <h2
            id="expertises-title"
            className="reveal mt-5 font-v2-display text-4xl leading-[1.1] text-navy md:text-6xl"
          >
            {EXPERTISES_COPY.titleLead}{" "}
            <em className="text-blue">{EXPERTISES_COPY.titleEmphasis}</em>
          </h2>
          <p className="reveal mt-6 text-lg text-pretty text-ink/75 md:text-xl">
            {EXPERTISES_COPY.lead}
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3">
          {featured.map(({ slug, title, icon: Icon, description }, index) => (
            <li key={slug} style={stagger(index)} className="reveal">
              <Wrap
                slug={slug}
                title={title}
                className="group relative block h-full overflow-hidden rounded-3xl bg-navy p-7 text-white md:p-8"
              >
                {/* Reflet doré dans un coin : écho de la lueur du hero. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, oklch(0.84 0.15 75 / 0.32), transparent)",
                  }}
                />
                <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="relative mt-6 font-v2-display text-2xl md:text-[1.75rem]">
                  {title}
                </h3>
                {description && (
                  <p className="relative mt-3 text-[0.95rem] leading-relaxed text-white/75">
                    {description}
                  </p>
                )}
                {(isPilier(slug) || hasAlbum(slug)) && (
                  <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-white/90 uppercase">
                    {isPilier(slug) ? "En savoir plus" : "Voir les réalisations"}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                )}
              </Wrap>
            </li>
          ))}
        </ul>

        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {others.map(({ slug, title, icon: Icon }, index) => (
            <li key={slug} style={stagger(index)} className="reveal">
              <Wrap
                slug={slug}
                title={title}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-6 text-center transition-[transform,border-color,box-shadow] duration-300 hover:border-blue/40 hover:shadow-elevated motion-safe:hover:-translate-y-0.5"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-sky text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="font-v2-display text-lg text-navy">{title}</h3>
              </Wrap>
            </li>
          ))}
        </ul>

        <div className="reveal mt-14 flex flex-col items-center gap-3 text-center">
          <Link href={V2_QUOTE_HREF} className={v2Button({ tone: "navy" })}>
            {nav.quoteLabel}
          </Link>
          <p className="text-sm text-muted">Nous vous rappelons {promise.callbackDelay}.</p>
        </div>
      </div>
    </section>
  );
}
