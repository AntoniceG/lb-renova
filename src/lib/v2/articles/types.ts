/** Un bloc de contenu d'article. Pas de Markdown : des blocs typés, simples à écrire et à contrôler. */
export type ArticleBlock =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: readonly string[] }
  | { type: "image"; src: string; alt: string; width: number; height: number; caption?: string };

export interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Article {
  /** Fin de l'adresse : /articles/<slug>. Lettres minuscules, chiffres et tirets. */
  slug: string;
  title: string;
  /** Résumé pour la liste et pour Google : 155 caractères au plus. */
  description: string;
  /** Date de publication, au format AAAA-MM-JJ. */
  date: string;
  /** Étiquette affichée (un métier, ou « Conseils »). */
  category: string;
  /** Page métier liée, en fin d'article (slug : renovation-complete, gros-oeuvre, climatisation). */
  pilier?: string;
  cover?: ArticleImage;
  /**
   * `true` = brouillon : visible seulement en développement et en aperçu, jamais sur le site en
   * ligne (SITE_ENV=production). Passer à `false` une fois l'article relu et validé.
   */
  draft: boolean;
  blocks: readonly ArticleBlock[];
}
