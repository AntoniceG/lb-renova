import { getPhoto } from "../realisations";
import type { Article } from "./types";

/**
 * PUBLIÉ le 2026-11-07 à la demande du client. Texte rédigé par l'assistant, à relire par un professionnel du métier. Contenu volontairement
 * général : aucun prix, aucun délai, aucune règle d'urbanisme précise.
 */
export const renovationCompleteParOuCommencer: Article = {
  slug: "renovation-complete-par-ou-commencer",
  title: "Rénovation complète : par où commencer ?",
  description:
    "Dans quel ordre s'enchaînent les métiers d'une rénovation complète, et comment préparer son projet pour éviter les mauvaises surprises.",
  date: "2026-11-07",
  category: "Rénovation complète",
  pilier: "renovation-complete",
  cover: getPhoto(51),
  draft: false,
  blocks: [
    {
      type: "p",
      text: "Une rénovation complète mobilise plusieurs métiers qui interviennent les uns après les autres. Et l'ordre compte : un carrelage posé trop tôt sera abîmé par les travaux suivants, une saignée dans un mur déjà fini oblige à le reprendre. Voici la logique générale d'un chantier, pour savoir où l'on va avant de commencer.",
    },
    { type: "h2", text: "Commencer par poser son projet" },
    {
      type: "p",
      text: "Avant de consulter quiconque, notez les pièces concernées, l'usage de chacune, vos contraintes de calendrier et ce qui est prioritaire. Des photos, un plan même approximatif et une liste de souhaits suffisent pour une première conversation. La visite sur place fait le reste : elle permet de comprendre comment la maison est construite et ce qu'il est réaliste de changer.",
    },
    { type: "h2", text: "D'abord ce qui porte : le gros œuvre" },
    {
      type: "p",
      text: "Dalles, ouverture de murs porteurs, maçonnerie, extension : la structure se traite en premier, car tout le reste en dépend. Une cloison déplacée ou une pièce agrandie change l'emplacement des réseaux, des prises, des sols.",
    },
    { type: "h2", text: "Ensuite ce qui protège : toiture, façade, menuiseries" },
    {
      type: "p",
      text: "Une maison doit être à l'abri de la pluie et du vent avant d'accueillir des finitions fragiles. Toiture, façade et menuiseries extérieures se règlent donc avant les travaux intérieurs de finition.",
    },
    { type: "h2", text: "Puis ce qui passe dans les murs : réseaux et climatisation" },
    {
      type: "p",
      text: "Plomberie, électricité, liaisons d'une climatisation réversible : tout ce qui se cache dans les murs, les sols et les plafonds se pose avant de refermer. C'est le moment de penser les pièces une par une : où sont les prises, les points d'eau, les unités de climatisation, l'éclairage.",
    },
    { type: "h2", text: "Fermer, puis habiller : cloisons, sols, peinture" },
    {
      type: "p",
      text: "Les cloisons, doublages et plafonds en plaques de plâtre referment les murs. Viennent ensuite les sols, carrelage en tête, puis la peinture en dernier, quand les travaux salissants sont terminés.",
    },
    {
      type: "ol",
      items: [
        "Structure : dalles, ouvertures de murs, maçonnerie, extension",
        "Enveloppe : toiture, façade, menuiseries",
        "Réseaux : plomberie, électricité, liaisons de climatisation",
        "Cloisons, plafonds et isolation",
        "Sols et revêtements, carrelage",
        "Peinture et finitions",
      ],
    },
    { type: "h2", text: "Les erreurs qui coûtent cher" },
    {
      type: "ul",
      items: [
        "Penser à la décoration avant d'avoir réglé la structure et les réseaux",
        "Oublier de prévoir le passage des réseaux (climatisation, électricité) avant de fermer les cloisons",
        "Poser les sols avant la fin des travaux salissants",
        "Confier chaque métier à une entreprise différente, sans personne pour tenir l'ordre du chantier",
      ],
    },
    { type: "h2", text: "Un seul interlocuteur pour tenir l'ordre" },
    {
      type: "p",
      text: "Quand plusieurs entreprises se succèdent, c'est à vous de faire le lien : prévenir l'électricien que la cloison est prête, caler le carreleur après la chape, vérifier que la peinture n'attend pas un chantier en retard. Un seul interlocuteur absorbe cette coordination et garde la vue d'ensemble, du premier échange jusqu'à la fin du chantier.",
    },
  ],
};
