import { env } from "@/config/env";
import { publishedArticles } from "./articles";
import { AVIS } from "./avis";

/** Même règle que la section Avis : sur le site publié, elle disparaît tant qu'un avis est fictif. */
const avisVisibles = !(env.isPublicDeployment && AVIS.some((avis) => avis.fictif));

export interface V2NavLink {
  label: string;
  href: string;
}

/**
 * Menu du site. Les liens vers les sections de la page d'accueil commencent par `/#` pour marcher
 * aussi depuis les autres pages. « Articles » n'apparaît que s'il y a au moins un article publiable
 * (en production, les brouillons ne comptent pas).
 */
export const V2_NAV: readonly V2NavLink[] = [
  { label: "Expertises", href: "/#expertises" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Notre histoire", href: "/#histoire" },
  ...(avisVisibles ? [{ label: "Avis", href: "/#avis" }] : []),
  ...(publishedArticles().length > 0 ? [{ label: "Articles", href: "/articles" }] : []),
  { label: "Secteur", href: "/#zone" },
];

/** Page du formulaire de devis (tous les boutons « Devis gratuit » y mènent). */
export const V2_QUOTE_HREF = "/devis";
