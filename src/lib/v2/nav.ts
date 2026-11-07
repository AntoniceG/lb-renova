import { publishedArticles } from "./articles";

export interface V2NavLink {
  label: string;
  href: string;
}

/**
 * Menu de la refonte. Les liens pointent vers des ancres de la page d'accueil V2, avec `/v2` devant
 * pour qu'ils marchent aussi depuis les autres pages. « Articles » n'apparaît que s'il y a au moins
 * un article publiable (en production, les brouillons ne comptent pas).
 */
export const V2_NAV: readonly V2NavLink[] = [
  { label: "Expertises", href: "/v2#expertises" },
  { label: "Réalisations", href: "/v2/realisations" },
  { label: "Notre histoire", href: "/v2#histoire" },
  { label: "Avis", href: "/v2#avis" },
  ...(publishedArticles().length > 0 ? [{ label: "Articles", href: "/v2/articles" }] : []),
  { label: "Secteur", href: "/v2#zone" },
];

/**
 * Page du formulaire de devis de la refonte (même formulaire que le site actuel, habillé en doré).
 * À la migration, la page devient `/devis` : remettre cette constante à "/devis".
 */
export const V2_QUOTE_HREF = "/v2/devis";
