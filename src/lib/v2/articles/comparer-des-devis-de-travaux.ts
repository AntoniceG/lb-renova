import type { Article } from "./types";

/**
 * BROUILLON (2026-11-09), rédigé par l'assistant : à relire par un professionnel du métier avant
 * publication. Conseils généraux, sans prix ni règle précise. À PUBLIER SEULEMENT quand les
 * mentions légales du site sont complètes : l'article invite à vérifier l'identité, l'immatriculation
 * et l'assurance d'une entreprise, le site doit donc les afficher lui aussi.
 */
export const comparerDesDevis: Article = {
  slug: "comparer-des-devis-de-travaux",
  title: "Comparer des devis de travaux : quoi vérifier ?",
  description:
    "Deux devis pour le même chantier, deux montants très différents : les points à vérifier pour comparer à périmètre égal et éviter les mauvaises surprises.",
  date: "2026-11-09",
  category: "Conseils",
  pilier: "renovation-complete",
  draft: true,
  blocks: [
    {
      type: "p",
      text: "Pour un même projet, deux devis peuvent différer nettement. Avant de conclure que l'un est trop cher ou l'autre étonnamment bas, il faut vérifier qu'ils décrivent bien la même chose. Voici les points à regarder, dans l'ordre.",
    },
    { type: "h2", text: "Un devis décrit les travaux, il ne les résume pas" },
    {
      type: "p",
      text: "Un bon devis détaille ce qui sera fait, pièce par pièce ou poste par poste : nature des travaux, surfaces ou quantités, matériaux prévus avec leur référence ou leur gamme. Une ligne unique du type « rénovation salle de bain » ne permet de rien comparer, ni de vérifier plus tard que ce qui était promis a été fait.",
    },
    { type: "h2", text: "Ce qui est inclus, et ce qui ne l'est pas" },
    {
      type: "p",
      text: "L'écart entre deux devis vient souvent de ce que l'un compte et que l'autre laisse de côté. Posez-vous la question pour chacun de ces postes :",
    },
    {
      type: "ul",
      items: [
        "la protection des sols et des meubles pendant le chantier",
        "l'évacuation des gravats et des déchets",
        "la fourniture des matériaux, ou seulement leur pose",
        "les reprises de finition : enduit, peinture après une saignée ou une dépose",
        "le nettoyage de fin de chantier",
      ],
    },
    { type: "h2", text: "Qui est l'entreprise, et est-elle assurée ?" },
    {
      type: "p",
      text: "Le devis doit indiquer l'identité complète de l'entreprise, son adresse et son numéro d'immatriculation. Pour des travaux de bâtiment, demandez aussi l'attestation d'assurance décennale en cours de validité : elle précise l'assureur et les activités couvertes. Vérifiez que les métiers de votre chantier y figurent.",
    },
    { type: "h2", text: "Délais et conditions de paiement" },
    {
      type: "p",
      text: "Un devis sérieux précise la durée de validité de l'offre, la date de début envisagée et la durée estimée des travaux. Regardez aussi comment le paiement est échelonné : il est d'usage de le répartir selon l'avancement du chantier plutôt que de tout régler au départ.",
    },
    { type: "h2", text: "Méfiez-vous du prix seul" },
    {
      type: "p",
      text: "Un montant nettement plus bas que les autres invite à chercher ce qui manque : un poste oublié, un matériau d'une gamme inférieure, une prestation à ajouter en cours de route. L'inverse est vrai aussi : un montant élevé se justifie quand il couvre un périmètre plus complet. Comparez à périmètre égal, ligne par ligne.",
    },
    { type: "h2", text: "La visite avant le devis" },
    {
      type: "p",
      text: "Un devis chiffré sans avoir vu le chantier repose sur des hypothèses. Une visite sur place permet de relever l'état réel du logement, de repérer les contraintes (accès, structure, réseaux existants) et de proposer un devis qui tient. C'est aussi l'occasion de poser vos questions à la personne qui suivra le chantier.",
    },
  ],
  faq: [
    {
      question: "Que doit contenir un devis de travaux ?",
      reponse:
        "Il doit détailler les travaux, les matériaux, les quantités, les délais, les conditions de paiement et identifier l'entreprise (adresse, numéro d'immatriculation, assurance). Plus il est précis, plus il est comparable.",
    },
    {
      question: "Pourquoi deux devis peuvent-ils être très différents ?",
      reponse:
        "Le plus souvent, parce qu'ils ne couvrent pas le même périmètre : matériaux de gammes différentes, postes inclus dans l'un et absents de l'autre (évacuation des gravats, reprises de finition, protections).",
    },
    {
      question: "Faut-il demander l'attestation d'assurance décennale ?",
      reponse:
        "Oui, pour des travaux de bâtiment. Elle précise l'assureur, la période de validité et les activités couvertes ; vérifiez que les métiers de votre chantier y figurent.",
    },
  ],
};
