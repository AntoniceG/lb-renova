import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeCta } from "@/components/v2/home-cta";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { EXPERTISES } from "@/lib/v2/expertises";
import { ALBUMS, hasAlbum } from "@/lib/v2/realisations";

// Pages de travail de la refonte : jamais indexées tant que le client n'a pas validé la migration.
export const metadata: Metadata = {
  title: "Nos réalisations à Marseille et Aix-en-Provence",
  description:
    "Photos de nos chantiers à Marseille et Aix-en-Provence : rénovation, gros œuvre, façade, couverture, carrelage et plus. Un album par métier.",
  robots: { index: false, follow: false },
};

export default function RealisationsPage() {
  const aVenir = EXPERTISES.filter(({ slug }) => !hasAlbum(slug)).map(({ title }) => title);

  return (
    <V2PageShell>
      <section className="v2-relief bg-(--cream) pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              Nos réalisations
            </p>
            <h1 className="mt-5 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
              Nos chantiers, <em className="text-blue">métier par métier</em>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Du gros œuvre aux finitions : choisissez un métier pour voir quelques-uns de nos
              chantiers.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Albums photo" className="bg-white py-16 md:py-24">
        <div className="container-page">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALBUMS.map(({ slug, title, photos }) => {
              const cover = photos[0];
              if (!cover) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/v2/realisations/${slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden bg-navy focus-visible:outline-blue"
                  >
                    <Image
                      src={cover.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-navy-deep/85 via-navy-deep/10 to-transparent"
                    />
                    <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <span className="block font-v2-display text-3xl">{title}</span>
                      <span className="mt-1 block text-xs font-semibold tracking-[0.2em] text-white/75 uppercase">
                        {photos.length} photos
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {aVenir.length > 0 && (
            <p className="mt-10 text-center text-sm tracking-wide text-muted">
              Albums à venir : {aVenir.join(", ")}.
            </p>
          )}
        </div>
      </section>

      <HomeCta />
    </V2PageShell>
  );
}
