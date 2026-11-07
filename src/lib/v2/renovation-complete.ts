import type { ServiceContent } from "@/content/services";

/**
 * Page « Rénovation complète » de la refonte. BROUILLON à faire valider par le client : le site
 * actuel n'a pas de page pour ce métier, donc ce texte est nouveau. Il reste volontairement
 * général : aucun prix, aucun délai, aucune certification, aucune règle d'urbanisme précise.
 * Seuls les faits donnés par le client sont repris (un seul interlocuteur, plusieurs métiers,
 * esprit de famille, devis gratuit, rappel sous 48 h).
 */
export const renovationComplete: ServiceContent = {
  slug: "renovation-complete",
  metaTitle: "Rénovation complète à Marseille et Aix-en-Provence",
  metaDescription:
    "Rénovation complète à Marseille et Aix-en-Provence : gros œuvre, plomberie, électricité, placo, carrelage, peinture. Un seul interlocuteur. Devis gratuit.",
  lead: "De la maçonnerie à la peinture, un seul interlocuteur pour l'ensemble de votre chantier : rénovation complète d'une maison ou d'un appartement, avec plusieurs corps de métier réunis autour d'un même projet.",
  benefits: [
    {
      title: "Un seul interlocuteur",
      text: "Du premier échange à la fin du chantier, une seule personne vous répond. Vous n'avez pas à courir après chacun des artisans.",
    },
    {
      title: "Plusieurs métiers réunis",
      text: "Gros œuvre, plomberie, électricité, placo, carrelage, peinture : les corps de métier d'un même chantier travaillent ensemble, dans un esprit de famille.",
    },
    {
      title: "Un devis gratuit, un rappel rapide",
      text: "Décrivez votre projet en quelques étapes : le devis est gratuit et nous vous rappelons sous 48 h pour en parler avec vous.",
    },
  ],
  solutions: [
    {
      title: "Gros œuvre et structure",
      text: "Dalles, ouverture de murs porteurs, maçonnerie, extensions : la structure de la maison, celle qui doit durer, se traite avant tout le reste.",
    },
    {
      title: "Plomberie et électricité",
      text: "Alimentations, évacuations, circuits, prises, éclairage : les réseaux se pensent pièce par pièce, selon l'usage, avant que les murs ne soient refermés.",
    },
    {
      title: "Cloisons, plafonds et isolation",
      text: "Cloisons, doublages et plafonds en plaques de plâtre redessinent les volumes et préparent les finitions.",
    },
    {
      title: "Carrelage",
      text: "Sols et murs des pièces de vie, des salles d'eau, des cuisines et des terrasses : le carrelage se pose sur un support préparé et de niveau.",
    },
    {
      title: "Peinture et finitions",
      text: "La peinture vient en dernier : préparation soignée des supports, puis finitions qui donnent à l'ensemble son unité.",
    },
    {
      title: "Façade, couverture et climatisation",
      text: "Selon le projet, la rénovation s'étend à l'enveloppe de la maison (façade, toiture) et au confort d'été comme d'hiver avec une climatisation réversible.",
    },
  ],
  guides: [
    {
      title: "Par où commencer une rénovation complète ?",
      paragraphs: [
        "Une rénovation complète mobilise plusieurs métiers qui interviennent les uns après les autres, et leur ordre compte. Un carrelage posé trop tôt sera abîmé par les travaux suivants ; une saignée dans un mur déjà fini oblige à le reprendre. La logique générale d'un chantier suit la même progression : d'abord ce qui porte, puis ce qui protège, puis ce qui passe dans les murs, enfin ce qui se voit.",
        "Avant même de consulter, il est utile de poser son projet : les pièces concernées, les usages de chacune, les contraintes de calendrier, ce qui est prioritaire. Des photos, un plan même approximatif et une liste de souhaits suffisent pour une première conversation. La visite sur place fait le reste.",
      ],
      points: [
        "Structure : dalles, ouvertures de murs, maçonnerie, extension",
        "Enveloppe : toiture, façade, menuiseries",
        "Réseaux : plomberie, électricité, liaisons de climatisation",
        "Cloisons, plafonds et isolation en plaques de plâtre",
        "Sols et revêtements : carrelage",
        "Peinture et finitions",
      ],
    },
    {
      title: "Un seul interlocuteur pour tenir cet ordre",
      paragraphs: [
        "Quand chaque métier est confié à une entreprise différente, c'est à vous de faire le lien : prévenir l'électricien que la cloison est prête, caler la venue du carreleur après la chape, vérifier que la peinture n'attend pas un chantier en retard. Un seul interlocuteur absorbe cette coordination et garde la vue d'ensemble du chantier.",
        "C'est le choix de LB Rénova : plusieurs artisans réunis autour d'un même projet, dans un esprit de famille, avec une personne pour vous répondre du premier échange jusqu'à la fin des travaux.",
      ],
    },
  ],
  process: [
    {
      title: "Visite et écoute",
      text: "Nous visitons le logement, observons l'existant et écoutons ce que vous voulez changer, pièce par pièce.",
    },
    {
      title: "Étude et devis",
      text: "Nous définissons les métiers nécessaires et leur ordre d'intervention. Le devis est gratuit ; nous vous rappelons sous 48 h après votre demande.",
    },
    {
      title: "Chantier coordonné",
      text: "Les artisans interviennent dans l'ordre qui protège le travail déjà fait, avec un seul interlocuteur pour répondre à vos questions.",
    },
    {
      title: "Réception",
      text: "Nous contrôlons ensemble le résultat, pièce par pièce, puis nous prononçons la réception. Elle marque le point de départ des garanties légales de construction.",
    },
  ],
  faq: [
    {
      question: "Qu'est-ce qu'une rénovation complète ?",
      answer:
        "C'est une rénovation qui touche l'ensemble d'un logement, ou la plus grande partie, et qui réunit plusieurs métiers : structure, réseaux, cloisons, sols, peinture. Plutôt que de multiplier les intervenants, vous confiez le projet à une seule entreprise.",
    },
    {
      question: "Qui coordonne les différents métiers ?",
      answer:
        "Un seul interlocuteur, du premier échange jusqu'à la fin du chantier. Il fait le lien entre les artisans et vous répond, pour que vous n'ayez pas à courir après chacun d'eux.",
    },
    {
      question: "Combien de temps dure une rénovation complète ?",
      answer:
        "La durée dépend de la surface, des métiers concernés et de l'état de départ. Nous la précisons après avoir visité le logement : donner un délai sans visite n'aurait pas de sens.",
    },
    {
      question: "Peut-on rester dans le logement pendant les travaux ?",
      answer:
        "Cela dépend de l'ampleur du chantier. Pour une rénovation complète, il est souvent plus confortable de libérer les pièces concernées. Nous organisons cela avec vous lors de la visite.",
    },
    {
      question: "Faut-il une autorisation pour rénover ?",
      answer:
        "Cela dépend du projet : des travaux intérieurs n'appellent en général pas d'autorisation, alors qu'une modification de façade ou une extension peut en demander une. En copropriété, le règlement et l'assemblée générale peuvent intervenir. La mairie reste la référence ; nous abordons ce point dès la visite.",
    },
    {
      question: "Le devis est-il gratuit ?",
      answer:
        "Oui, le devis est gratuit. Décrivez votre projet en quelques étapes sur la page devis : nous vous rappelons sous 48 h.",
    },
  ],
};
