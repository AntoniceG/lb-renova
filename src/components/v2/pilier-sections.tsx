import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import type { GuideSection, TitledText } from "@/content/services";
import { telHref } from "@/lib/brand";
import { PILIERS, type Marque, type Pilier } from "@/lib/v2/piliers";
import type { Album } from "@/lib/v2/realisations";
import { v2Button } from "./button-styles";

/** En-tête de la page : fil d'Ariane, titre avec la ville, accroche, boutons. */
export function PilierHero({ pilier }: { pilier: Pilier }) {
  const { contact, nav } = siteConfig;
  return (
    <section className="v2-relief bg-(--cream) pt-32 pb-16 md:pt-44 md:pb-24">
      <div className="container-page">
        <nav aria-label="Fil d'Ariane" className="text-xs tracking-[0.14em] text-muted uppercase">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/v2" className="hover:text-navy">
                Accueil
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-navy">
              {pilier.title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-4xl font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
          {pilier.title}
          <span className="mt-2 block text-3xl text-blue italic md:text-4xl">
            à Marseille et Aix-en-Provence
          </span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80 md:text-xl">
          {pilier.content.lead}
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
  );
}

/** Trois atouts côte à côte, séparés par un filet. */
export function PilierBenefits({ benefits }: { benefits: readonly TitledText[] }) {
  return (
    <section aria-label="Nos engagements" className="border-b border-navy/10 bg-white">
      <ul className="container-page grid divide-navy/10 md:grid-cols-3 md:divide-x">
        {benefits.map(({ title, text }) => (
          <li key={title} className="py-10 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0">
            <h2 className="font-v2-display text-2xl text-navy">{title}</h2>
            <p className="mt-4 leading-relaxed text-ink/80">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Les prestations, en cartes. */
export function PilierSolutions({
  title,
  solutions,
}: {
  title: string;
  solutions: readonly TitledText[];
}) {
  return (
    <section aria-labelledby="prestations-title" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <h2
          id="prestations-title"
          className="max-w-3xl font-v2-display text-4xl leading-[1.1] text-navy md:text-5xl"
        >
          {title}
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {solutions.map(({ title: name, text }) => (
            <li key={name} className="border border-navy/12 bg-white p-7 md:p-9">
              <h3 className="font-v2-display text-2xl text-navy">{name}</h3>
              <p className="mt-4 leading-relaxed text-ink/80">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Les marques installées (logos officiels), avec la mention légale qui va avec. */
export function PilierMarques({ marques }: { marques: readonly Marque[] }) {
  return (
    <section aria-labelledby="marques-title" className="bg-white pb-20 md:pb-28">
      <div className="container-page">
        <div className="border-t border-navy/10 pt-14 md:pt-16">
          <h2
            id="marques-title"
            className="max-w-3xl font-v2-display text-3xl leading-[1.15] text-navy md:text-4xl"
          >
            Les marques que nous <em className="text-blue">installons</em>
          </h2>
          <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {marques.map(({ name, src, width, height }) => (
              <li
                key={name}
                className="flex items-center justify-center border border-navy/12 bg-white px-8 py-10"
              >
                <Image
                  src={src}
                  alt={name}
                  width={width}
                  height={height}
                  unoptimized
                  className="h-auto w-44 md:w-52"
                />
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm text-muted">
            {marques.map(({ name }) => name).join(" et ")} sont des marques déposées de leurs
            propriétaires respectifs.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Aperçu de l'album photo du métier (s'il existe) avec lien vers l'album complet. */
export function PilierPhotos({ album }: { album: Album }) {
  const apercu = album.photos.slice(0, 6);
  return (
    <section aria-labelledby="photos-title" className="v2-relief bg-(--cream) py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2
            id="photos-title"
            className="max-w-2xl font-v2-display text-4xl leading-[1.1] text-navy md:text-5xl"
          >
            Nos réalisations en <em className="text-blue">{album.title.toLowerCase()}</em>
          </h2>
          <Link
            href={`/v2/realisations/${album.slug}`}
            className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-navy uppercase focus-visible:outline-blue"
          >
            Voir les {album.photos.length} photos
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {apercu.map((photo) => (
            <li key={photo.number} className="relative aspect-[4/3] overflow-hidden bg-navy/5">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 380px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Les textes de fond : de vrais paragraphes lisibles, utiles au lecteur comme au référencement. */
export function PilierGuides({ guides }: { guides: readonly GuideSection[] }) {
  return (
    <section aria-label="Bien comprendre" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-3xl space-y-16">
          {guides.map(({ title, paragraphs, points }) => (
            <article key={title}>
              <h2 className="font-v2-display text-3xl leading-[1.15] text-navy md:text-4xl">
                {title}
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {points && (
                <ul className="mt-6 space-y-3 border-l-2 border-(--gold) pl-6 text-lg text-ink/85">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Les quatre étapes, numérotées en grand. */
export function PilierProcess({ title, steps }: { title: string; steps: readonly TitledText[] }) {
  return (
    <section aria-labelledby="process-title" className="bg-navy py-20 text-white md:py-28">
      <div className="container-page">
        <h2
          id="process-title"
          className="max-w-3xl font-v2-display text-4xl leading-[1.1] md:text-5xl"
        >
          {title}
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          {steps.map(({ title: name, text }, index) => (
            <li key={name}>
              <span aria-hidden className="font-v2-display text-5xl text-(--gold) italic">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-v2-display text-2xl">{name}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Liens vers les autres pages métier et vers l'ensemble des réalisations. */
export function PilierAutres({ currentSlug }: { currentSlug: string }) {
  const autres = PILIERS.filter(({ slug }) => slug !== currentSlug);
  return (
    <section aria-labelledby="autres-title" className="v2-relief bg-(--cream) py-16 md:py-20">
      <div className="container-page">
        <h2 id="autres-title" className="font-v2-display text-3xl text-navy md:text-4xl">
          Voir aussi
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {autres.map(({ slug, title }) => (
            <li key={slug}>
              <Link
                href={`/v2/${slug}`}
                className="inline-flex min-h-11 items-center border border-navy/25 px-5 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-blue"
              >
                {title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/v2/realisations"
              className="inline-flex min-h-11 items-center border border-navy/25 px-5 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-blue"
            >
              Toutes nos réalisations
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
