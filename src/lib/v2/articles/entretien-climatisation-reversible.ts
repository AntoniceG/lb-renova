import type { Article } from "./types";

/**
 * BROUILLON (2026-11-09), rédigé par l'assistant : à relire par un professionnel du métier avant
 * publication. Il reprend la FAQ de la page Climatisation, sans fréquence ni obligation chiffrée.
 */
export const entretienClimatisationReversible: Article = {
  slug: "entretenir-sa-climatisation-les-bons-gestes",
  title: "Entretenir sa climatisation : les bons gestes",
  description:
    "Filtres, unité extérieure, condensats, contrôle professionnel : ce qu'on peut faire soi-même et ce qu'il vaut mieux confier à un installateur.",
  date: "2026-11-09",
  category: "Climatisation",
  pilier: "climatisation",
  draft: true,
  blocks: [
    {
      type: "p",
      text: "Une climatisation bien entretenue rafraîchit mieux, consomme moins et dure plus longtemps. L'essentiel de l'entretien courant est à la portée de chacun ; le reste revient à un professionnel. Voici le partage des tâches.",
    },
    { type: "h2", text: "Ce que vous pouvez faire vous-même" },
    {
      type: "p",
      text: "Les filtres des unités intérieures se nettoient régulièrement, souvent plusieurs fois par an en période d'utilisation. Des filtres encrassés réduisent le débit d'air, fatiguent l'appareil et dégradent la qualité de l'air soufflé. Le geste est simple et décrit dans la notice de l'appareil.",
    },
    {
      type: "ul",
      items: [
        "Nettoyer les filtres des unités intérieures",
        "Dégager l'unité extérieure : pas de plantes, de bâches ni d'objets collés contre elle",
        "Essuyer l'extérieur des unités avec un chiffon doux, appareil à l'arrêt",
        "Vérifier que l'eau de condensation s'évacue normalement",
      ],
    },
    { type: "h2", text: "Ce qui revient à un professionnel" },
    {
      type: "p",
      text: "Un contrôle périodique par un installateur vérifie l'étanchéité du circuit, l'évacuation des condensats et le bon fonctionnement général. La manipulation des fluides frigorigènes est réservée aux professionnels habilités : on n'y touche pas soi-même.",
    },
    { type: "h2", text: "Les signes qui doivent alerter" },
    {
      type: "ul",
      items: [
        "Une odeur inhabituelle quand l'appareil souffle",
        "Une fuite d'eau à l'intérieur",
        "Un bruit nouveau ou une vibration",
        "Un appareil qui rafraîchit ou chauffe moins qu'avant",
      ],
    },
    { type: "h2", text: "Les bons réflexes d'usage" },
    {
      type: "p",
      text: "Fermer portes et fenêtres pendant le fonctionnement, choisir une température de consigne raisonnable plutôt que le minimum, et éviter de couper et relancer l'appareil sans cesse : ces habitudes protègent l'appareil et le confort. En cas de doute, l'installateur qui a posé l'appareil connaît votre installation.",
    },
  ],
  faq: [
    {
      question: "À quelle fréquence nettoyer les filtres d'une climatisation ?",
      reponse:
        "Régulièrement : souvent plusieurs fois par an en période d'utilisation. La notice de l'appareil précise le rythme conseillé.",
    },
    {
      question: "Peut-on recharger soi-même le gaz d'une climatisation ?",
      reponse:
        "Non. La manipulation des fluides frigorigènes est réservée aux professionnels habilités. Si l'appareil rafraîchit moins bien, faites contrôler l'installation.",
    },
    {
      question: "Que vérifie un professionnel lors d'un contrôle ?",
      reponse:
        "L'étanchéité du circuit, l'évacuation des condensats et le bon fonctionnement général de l'appareil.",
    },
  ],
};
