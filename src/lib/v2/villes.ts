import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";

/** Une page par ville (`/zones/<slug>`) n'est publiée qu'avec au moins ce nombre de paragraphes locaux. */
export const MIN_LOCAL_PARAGRAPHS = 2;

/** Longueur minimale d'un paragraphe local : une phrase passe-partout ne compte pas. */
export const MIN_LOCAL_LENGTH = 200;

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Contenu PROPRE à chaque ville, par adresse (`marseille`, `aix-en-provence`, `gardanne`,
 * `salon-de-provence`, `pertuis`). C'est ce qui rend la page utile, et différente des autres :
 * type de bâti rencontré, quartiers ou communes voisines desservies, projet réalisé sur place,
 * contraintes locales (copropriétés, secteurs protégés…). Chaque paragraphe doit venir de
 * l'expérience réelle de l'entreprise : rien ne s'invente ici.
 *
 * Tant qu'une ville n'a pas au moins `MIN_LOCAL_PARAGRAPHS` paragraphes d'au moins
 * `MIN_LOCAL_LENGTH` caractères, sa page reste un BROUILLON : visible en aperçu seulement, absente
 * du site en ligne et du sitemap. Google traite des pages de villes qui ne changent que le nom de la
 * commune comme du contenu creux. Informations à demander au client : voir TODO_CLIENT.md.
 */
const LOCAL: Readonly<Record<string, readonly string[]>> = {};

export interface Ville {
  slug: string;
  name: string;
  /** Paragraphes propres à la ville (voir `LOCAL`). */
  local: readonly string[];
  /** `true` tant que le contenu local est insuffisant : jamais montré sur le site en ligne. */
  draft: boolean;
}

const isUsable = (paragraphs: readonly string[]) =>
  paragraphs.length >= MIN_LOCAL_PARAGRAPHS &&
  paragraphs.every((text) => text.length >= MIN_LOCAL_LENGTH);

export const VILLES: readonly Ville[] = siteConfig.area.priorityCities.map((name) => {
  const slug = slugify(name);
  const local = LOCAL[slug] ?? [];
  return { slug, name, local, draft: !isUsable(local) };
});

/** Les pages visibles : en production, seulement celles qui ont leur contenu local. */
export function publishedVilles(): readonly Ville[] {
  return VILLES.filter((ville) => !ville.draft || !env.isProduction);
}

export function getVille(slug: string): Ville | undefined {
  return publishedVilles().find((ville) => ville.slug === slug);
}

/** Adresse de la page d'une ville si elle est visible, sinon `undefined` (pas de lien mort). */
export function villeHref(name: string): string | undefined {
  const ville = publishedVilles().find((item) => item.name === name);
  return ville ? `/zones/${ville.slug}` : undefined;
}
