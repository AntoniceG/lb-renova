import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumGallery } from "@/components/v2/album-gallery";
import { HomeCta } from "@/components/v2/home-cta";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { ALBUMS, getAlbum } from "@/lib/v2/realisations";

/** « | LB Rénova » : ce que `pageMetadata` ajoute derrière le titre. */
const TITLE_BRAND_SUFFIX = ` | ${siteConfig.brand.name}`.length;

interface AlbumPageProps {
  params: Promise<{ metier: string }>;
}

// Seuls les albums qui ont des photos existent ; tout autre segment → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALBUMS.map(({ slug }) => ({ metier: slug }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { metier } = await params;
  const album = getAlbum(metier);
  if (!album) return {};
  // Google coupe un titre au-delà de 60 caractères (marque comprise) : version courte si besoin.
  const longTitle = `${album.title} à Marseille et Aix : réalisations`;
  const title =
    longTitle.length + TITLE_BRAND_SUFFIX > 60 ? `${album.title} : nos réalisations` : longTitle;
  // Certaines introductions sont très courtes (une phrase) : on complète si la limite le permet.
  const extended = `${album.intro} Photos de chantiers et devis gratuit.`;
  return pageMetadata({
    title,
    description: extended.length <= 155 ? extended : album.intro,
    path: `/realisations/${album.slug}`,
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { metier } = await params;
  const album = getAlbum(metier);
  if (!album) notFound();

  const autres = ALBUMS.filter(({ slug }) => slug !== album.slug);

  return (
    <V2PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Réalisations", path: "/realisations" },
          { name: album.title, path: `/realisations/${album.slug}` },
        ])}
      />
      <section className="v2-relief bg-(--cream) pt-32 pb-12 md:pt-44 md:pb-16">
        <div className="container-page">
          <nav aria-label="Fil d'Ariane" className="text-xs tracking-[0.14em] text-muted uppercase">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-navy">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/realisations" className="hover:text-navy">
                  Réalisations
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="font-semibold text-navy">
                {album.title}
              </li>
            </ol>
          </nav>

          <h1 className="mt-8 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
            {album.title}
            <span className="mt-2 block text-3xl text-blue italic md:text-4xl">
              nos réalisations
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/80 md:text-xl">
            {album.intro}
          </p>
        </div>
      </section>

      <section aria-label={`Photos : ${album.title}`} className="bg-white py-12 md:py-20">
        <div className="container-page">
          <AlbumGallery photos={album.photos} album={album.title} />
        </div>
      </section>

      {autres.length > 0 && (
        <section aria-labelledby="autres-albums" className="v2-relief bg-(--cream) py-14 md:py-20">
          <div className="container-page">
            <h2 id="autres-albums" className="font-v2-display text-3xl text-navy md:text-4xl">
              Voir aussi
            </h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {autres.map(({ slug, title }) => (
                <li key={slug}>
                  <Link
                    href={`/realisations/${slug}`}
                    className="inline-flex min-h-11 items-center border border-navy/25 px-5 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-blue"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <HomeCta />
    </V2PageShell>
  );
}
