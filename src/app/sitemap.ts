import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { publishedArticles } from "@/lib/v2/articles";
import { PILIER_SLUGS } from "@/lib/v2/piliers";
import { ALBUMS } from "@/lib/v2/realisations";

/**
 * Plan du site pour Google (`/sitemap.xml`). Il se met à jour tout seul : un nouvel article ou un
 * nouvel album (2 photos minimum) y apparaît dès qu'il existe. Ne figurent pas : la page de
 * remerciement et le banc d'essai (jamais montrés dans Google).
 * La date de modification n'est donnée que pour les articles : c'est la seule qu'on connaisse
 * vraiment, et Google ignore les dates approximatives.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    priority,
  });

  return [
    page("/", 1),
    ...PILIER_SLUGS.map((slug) => page(`/${slug}`, 0.9)),
    page("/devis", 0.8),
    page("/realisations", 0.7),
    ...ALBUMS.map(({ slug }) => page(`/realisations/${slug}`, 0.5)),
    ...(publishedArticles().length > 0 ? [page("/articles", 0.6)] : []),
    ...publishedArticles().map(({ slug, date }) => ({
      ...page(`/articles/${slug}`, 0.6),
      lastModified: date,
    })),
    page("/mentions-legales", 0.1),
  ];
}
