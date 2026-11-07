import { env } from "@/config/env";
import { climatisationBienChoisir } from "./climatisation-bien-choisir";
import { renovationCompleteParOuCommencer } from "./renovation-complete-par-ou-commencer";
import type { Article, ArticleBlock } from "./types";

export type { Article, ArticleBlock, ArticleImage } from "./types";

/**
 * Tous les articles. Pour en publier un : créer un fichier dans ce dossier (voir les exemples),
 * l'ajouter ici, et mettre `draft: false` une fois relu. Les brouillons n'apparaissent jamais en production.
 */
const ARTICLES: readonly Article[] = [renovationCompleteParOuCommencer, climatisationBienChoisir];

/** Les articles visibles, du plus récent au plus ancien. */
export function publishedArticles(): readonly Article[] {
  return ARTICLES.filter((article) => !article.draft || !env.isProduction).toSorted((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getArticle(slug: string): Article | undefined {
  return publishedArticles().find((article) => article.slug === slug);
}

const wordsOf = (block: ArticleBlock): number => {
  if (block.type === "image") return 0;
  const text = "text" in block ? block.text : block.items.join(" ");
  return text.split(/\s+/).filter(Boolean).length;
};

/** Temps de lecture estimé (200 mots par minute), au moins une minute. */
export function readingMinutes(article: Article): number {
  const words = article.blocks.reduce((total, block) => total + wordsOf(block), 0);
  return Math.max(1, Math.round(words / 200));
}

/** « 7 novembre 2026 » : la date est lue en UTC pour ne pas bouger selon le fuseau du serveur. */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
