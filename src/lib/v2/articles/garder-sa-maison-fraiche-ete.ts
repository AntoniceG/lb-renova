import type { Article } from "./types";

/**
 * BROUILLON (2026-11-09), rédigé par l'assistant : à relire par un professionnel du métier avant
 * publication. Principes généraux de confort d'été, sans chiffre ni performance annoncée.
 */
export const garderSaMaisonFraicheEte: Article = {
  slug: "garder-sa-maison-fraiche-l-ete-dans-le-sud",
  title: "Garder sa maison fraîche l'été dans le Sud",
  description:
    "Toiture, volets, ventilation, climatisation : ce qui fait vraiment la différence pour rester au frais quand il fait chaud, et dans quel ordre agir.",
  date: "2026-11-09",
  category: "Climatisation",
  pilier: "climatisation",
  draft: true,
  blocks: [
    {
      type: "p",
      text: "Dans le Sud, les étés chauds imposent de penser le confort bien avant d'acheter un climatiseur. Une maison qui chauffe moins demande moins d'efforts à ses appareils. Voici les leviers, du plus simple au plus technique.",
    },
    { type: "h2", text: "Arrêter la chaleur avant qu'elle n'entre" },
    {
      type: "p",
      text: "Le soleil qui traverse une vitre chauffe la pièce. Les protections placées à l'extérieur (volets, stores, brise-soleil) sont les plus efficaces, parce qu'elles arrêtent le rayonnement avant la vitre. Fermés en journée, ils font déjà beaucoup.",
    },
    { type: "h2", text: "La toiture et les combles, premières surfaces exposées" },
    {
      type: "p",
      text: "Le toit reçoit le soleil toute la journée. Une toiture en bon état et des combles isolés limitent la chaleur transmise aux pièces du dessus, souvent les plus difficiles à rafraîchir. C'est un point que l'on regarde lors d'une rénovation de couverture.",
    },
    { type: "h2", text: "Aérer au bon moment" },
    {
      type: "p",
      text: "Ouvrir les fenêtres tôt le matin et en soirée, quand l'air extérieur est plus frais, puis les refermer en journée avec les volets : ce geste gratuit évite que la chaleur ne s'accumule. Une circulation d'air entre deux façades (courant d'air traversant) accélère le rafraîchissement.",
    },
    { type: "h2", text: "Quand la climatisation devient utile" },
    {
      type: "p",
      text: "Quand ces gestes ne suffisent plus, une climatisation réversible apporte le complément : elle rafraîchit l'été et peut chauffer à la mi-saison. Elle fonctionne d'autant mieux que la maison garde sa fraîcheur. Dimensionner l'appareil sur la pièce et son exposition, plutôt que sur la seule surface, évite les erreurs courantes.",
    },
    {
      type: "ul",
      items: [
        "Protections solaires extérieures sur les façades les plus exposées",
        "Toiture et combles en bon état, isolés",
        "Aération le matin et le soir, volets fermés en journée",
        "Climatisation choisie à la bonne puissance, placée pour diffuser sans courant d'air gênant",
      ],
    },
    { type: "h2", text: "Un projet à regarder dans son ensemble" },
    {
      type: "p",
      text: "Isolation, ouvertures, climatisation : ces choix se répondent. Lors d'une rénovation, c'est le bon moment de les penser ensemble, plutôt que d'ajouter un appareil à une maison qui chauffe trop.",
    },
  ],
  faq: [
    {
      question: "Comment rafraîchir une maison sans climatisation ?",
      reponse:
        "En agissant d'abord sur ce qui chauffe : protections solaires extérieures fermées en journée, aération le matin et le soir, combles et toiture en bon état.",
    },
    {
      question: "Faut-il isoler avant d'installer une climatisation ?",
      reponse:
        "Ce n'est pas obligatoire, mais une maison mieux protégée de la chaleur demande moins à son climatiseur. Les deux démarches se complètent.",
    },
    {
      question: "Une climatisation réversible chauffe-t-elle aussi ?",
      reponse:
        "Oui, c'est une pompe à chaleur air-air : elle rafraîchit l'été et chauffe à la mi-saison. Ses performances diminuent quand il fait très froid dehors.",
    },
  ],
};
