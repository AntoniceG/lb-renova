import { siteConfig } from "@/config/site.config";

export type HistoireKey = "origines" | "marseille" | "aujourdhui";

export interface HistoireBand {
  key: HistoireKey;
  /** Côté de l'image : `left` = image à gauche, texte à droite ; `right` = l'inverse. */
  side: "left" | "right";
  eyebrow: string;
  title: string;
  body: string;
}

/**
 * Textes de l'histoire, façon musée : trois bandes qui alternent image / texte.
 * BROUILLON à faire valider par le client. Faits fournis par lui (2026-11-06 et 07) :
 * le grand-père vient de Toscane, près de Pise, tailleur de pierre ; il arrive à Marseille en 1945
 * et devient maçon ; Léon Bracaloni, son petit-fils, perpétue la tradition et a élargi les métiers.
 *
 * ATTENTION, bande « 1945 : Le départ » : la raison du départ a été INVENTÉE à la demande du client
 * (2026-11-07). Elle reste volontairement générale (l'Italie de l'après-guerre, le travail rare, la
 * France à reconstruire) pour ne rien affirmer de précis sur le grand-père. À confirmer avec la famille.
 */
export const HISTOIRE = {
  eyebrow: `Depuis ${siteConfig.story.since}`,
  title: siteConfig.story.title,
  bands: [
    {
      key: "origines",
      side: "left",
      eyebrow: "Les origines",
      title: "Venus de Toscane, tailleurs de pierre.",
      body: "Tout commence près de Pise. Le grand-père de la famille Bracaloni y taille la pierre : un métier de patience et de précision, où rien ne se fait à moitié.",
    },
    {
      key: "marseille",
      side: "right",
      eyebrow: "Cap sur Marseille",
      title: "1945 : Le départ",
      body: "En 1945, l'Italie sort de la guerre épuisée. Autour de Pise, les villes sont meurtries et le travail se fait rare. À regret, il quitte sa Toscane natale pour la France, où tout est à reconstruire. À Marseille, le tailleur de pierre devient maçon : le métier change, l'exigence reste la même.",
    },
    {
      key: "aujourdhui",
      side: "left",
      eyebrow: "Aujourd'hui",
      title: "Léon perpétue la tradition.",
      body: "Petit-fils du tailleur de pierre, Léon Bracaloni poursuit le travail bien fait de la famille. Il a élargi les métiers de l'entreprise. Il réunit aujourd'hui plusieurs artisans autour de lui, dans un esprit de famille, pour faire aboutir vos rêves et vos envies.",
    },
  ] satisfies readonly HistoireBand[],
} as const;
