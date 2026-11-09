import type { Article } from "./types";

/**
 * BROUILLON (2026-11-09), rédigé par l'assistant : à relire par un professionnel du métier avant
 * publication. Il reprend la logique de la page Gros œuvre (étude, étaiement, autorisations),
 * sans prix, délai ni règle d'urbanisme précise.
 */
export const ouvrirUnMurPorteur: Article = {
  slug: "ouvrir-un-mur-porteur-les-etapes",
  title: "Ouvrir un mur porteur : les étapes à connaître",
  description:
    "Étude de structure, accords, étaiement, pose de la poutre : le déroulé d'une ouverture de mur porteur, étape par étape, pour savoir à quoi s'attendre.",
  date: "2026-11-09",
  category: "Gros œuvre",
  pilier: "gros-oeuvre",
  draft: true,
  blocks: [
    {
      type: "p",
      text: "Faire disparaître un mur pour agrandir une pièce est l'un des projets les plus courants en rénovation. Quand le mur est porteur, il ne s'agit plus d'une simple démolition : il supporte une partie du poids de la maison, et son ouverture se prépare. Voici les étapes, dans l'ordre.",
    },
    { type: "h2", text: "1. Savoir si le mur est porteur" },
    {
      type: "p",
      text: "On ne le devine pas à l'épaisseur du mur ni à son aspect. La visite d'un professionnel, l'examen des plans quand ils existent et, au besoin, quelques sondages permettent de savoir ce que le mur supporte : un plancher, une charpente, un étage entier.",
    },
    { type: "h2", text: "2. Faire étudier la structure" },
    {
      type: "p",
      text: "Dès qu'un projet modifie la structure porteuse, une étude de dimensionnement est indispensable. Elle détermine comment reprendre les charges une fois le mur ouvert : le type de poutre, ses dimensions, ses appuis. On ne choisit pas une poutre « à l'œil ».",
    },
    { type: "h2", text: "3. Vérifier les accords nécessaires" },
    {
      type: "p",
      text: "À l'intérieur d'une maison individuelle, l'ouverture d'un mur porteur ne demande en général pas d'autorisation d'urbanisme, sauf si elle modifie l'aspect extérieur ou si le bien se trouve dans un secteur protégé. En copropriété, l'accord de l'assemblée générale est nécessaire. En cas de doute, la mairie reste la référence.",
    },
    { type: "h2", text: "4. Étayer, puis ouvrir" },
    {
      type: "p",
      text: "Avant de toucher au mur, on le remplace temporairement par des étais qui reprennent les charges. Le mur peut alors être découpé et déposé sans que ce qu'il supportait ne bouge. Cette phase est la plus poussiéreuse : la zone est isolée du reste du logement.",
    },
    { type: "h2", text: "5. Poser la poutre et reprendre les charges" },
    {
      type: "p",
      text: "La poutre définie par l'étude est mise en place sur ses appuis, puis les charges lui sont transférées avant de retirer les étais. Cette étape ne s'improvise pas : c'est elle qui garantit que la structure reste saine.",
    },
    { type: "h2", text: "6. Reprendre les finitions" },
    {
      type: "p",
      text: "Une fois la poutre posée, il reste à habiller l'ouverture : enduits, plâtrerie, sols aux raccords, peinture. Selon les cas, des réseaux (électricité, plomberie) qui passaient dans le mur doivent aussi être déplacés, ce qui se prévoit dès le départ.",
    },
    {
      type: "ol",
      items: [
        "Identifier ce que supporte le mur",
        "Faire réaliser l'étude de structure",
        "Obtenir les accords nécessaires",
        "Étayer puis déposer le mur",
        "Poser la poutre et reporter les charges",
        "Reprendre les finitions et les réseaux",
      ],
    },
    { type: "h2", text: "La visite, point de départ" },
    {
      type: "p",
      text: "Chaque maison est construite à sa façon : ce qui est possible, et la manière de le faire, se décide sur place. C'est pourquoi le devis se prépare après une visite, pas avant.",
    },
  ],
  faq: [
    {
      question: "Un mur porteur peut-il être ouvert sans étude ?",
      reponse:
        "Non. Dès qu'un projet modifie la structure porteuse, une étude de dimensionnement est indispensable pour choisir la poutre et ses appuis.",
    },
    {
      question: "Faut-il une autorisation pour ouvrir un mur porteur ?",
      reponse:
        "À l'intérieur d'une maison individuelle, en général non, sauf si l'ouverture modifie l'aspect extérieur ou si le bien est en secteur protégé. En copropriété, l'accord de l'assemblée générale est nécessaire. La mairie reste la référence.",
    },
    {
      question: "Peut-on rester chez soi pendant l'ouverture d'un mur porteur ?",
      reponse:
        "C'est parfois possible, mais la poussière et l'étaiement imposent d'isoler la zone, voire de libérer la pièce. Cela s'organise lors de la visite.",
    },
  ],
};
