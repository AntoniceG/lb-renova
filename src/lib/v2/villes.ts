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
const LOCAL: Readonly<Record<string, readonly string[]>> = {
  // Réponses du client du 2026-11-10 : Marseille = surtout des maisons (extensions) ; Aix = surtout
  // des appartements (rénovation intérieure, climatisation) ; Marignane et Vitrolles = surélévations
  // avec aménagement des combles ; Éguilles = extension réalisée. Rien d'autre n'est avancé :
  // Gardanne, Salon-de-Provence et Pertuis restent des brouillons.
  marseille: [
    "À Marseille, nos chantiers concernent surtout des maisons individuelles, et la demande qui revient le plus est l'extension : agrandir la maison, notamment par surélévation, avec un seul interlocuteur pour la maçonnerie, les réseaux et les finitions plutôt qu'une succession d'entreprises à coordonner soi-même.",
    "Nous intervenons aussi autour de Marseille. À Marignane et à Vitrolles, nous avons réalisé des surélévations avec aménagement des combles, pour gagner de la surface habitable sans empiéter sur le terrain. Chaque maison étant différente, les accords nécessaires et les contraintes du terrain ou de l'accès sont étudiés lors du premier rendez-vous.",
  ],
  "aix-en-provence": [
    "À Aix-en-Provence, nous intervenons surtout dans des appartements. Les demandes qui reviennent le plus portent sur la rénovation intérieure : cloisons et plafonds en placo, peinture, salle de bain et cuisine, avec un seul interlocuteur pour faire travailler ensemble les différents métiers du chantier.",
    "La pose de climatisation fait aussi partie des demandes fréquentes en appartement. Elle se prépare avec le reste des travaux : le passage des liaisons, l'emplacement des unités et, en copropriété, ce que prévoit le règlement se règlent avant de refermer les cloisons et de repeindre. Chaque situation est étudiée lors du premier rendez-vous.",
    "Autour d'Aix, nous intervenons aussi sur des maisons : nous avons réalisé une extension à Éguilles, avec le même interlocuteur de la première visite à la fin du chantier. Le terrain, l'accès et les règles de la commune sont regardés dès cette première visite, avant de décider de la meilleure façon de procéder.",
  ],
};

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
