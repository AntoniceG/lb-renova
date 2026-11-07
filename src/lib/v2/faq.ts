import { siteConfig } from "@/config/site.config";
import { EXPERTISES } from "./expertises";
import { ZONE } from "./zone";

export interface Question {
  question: string;
  reponse: string;
}

const { callbackDelay } = siteConfig.promise;
const metiers = EXPERTISES.map(({ title }) => title.toLowerCase());
const villes = [...ZONE.principales, ...ZONE.autres];

/**
 * Questions fréquentes. BROUILLON à faire valider par le client. Réponses volontairement prudentes :
 * elles reprennent seulement ce que le client a fourni (métiers, villes, délai de rappel,
 * interlocuteur unique) et une définition générale de la garantie décennale.
 */
export const FAQ: readonly Question[] = [
  {
    question: "Le devis est-il gratuit ?",
    reponse: `Oui, le devis est gratuit. Décrivez votre projet en quelques étapes sur la page devis : nous vous rappelons ${callbackDelay}.`,
  },
  {
    question: "Qui est mon interlocuteur pendant le chantier ?",
    reponse:
      "Une seule personne, du premier échange jusqu'à la fin des travaux. Même si plusieurs métiers interviennent chez vous, vous n'avez pas à courir après chacun d'eux.",
  },
  {
    question: "Quels métiers pouvez-vous réunir sur un même chantier ?",
    reponse: `${metiers.slice(0, -1).join(", ")} et ${metiers.at(-1)}. Un projet peut mêler plusieurs de ces métiers : c'est justement l'intérêt d'avoir un seul interlocuteur.`,
  },
  {
    question: "Où intervenez-vous ?",
    reponse: `À ${villes.slice(0, -1).join(", ")} et ${villes.at(-1)}, ainsi que dans les communes alentour. En cas de doute, décrivez votre projet et nous vous répondons.`,
  },
  {
    question: "Que couvre la garantie décennale ?",
    reponse:
      "La garantie décennale est une assurance obligatoire pour les professionnels du bâtiment. Pendant dix ans après la réception des travaux, elle couvre les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à son usage.",
  },
  {
    question: "Que se passe-t-il après l'envoi de ma demande ?",
    reponse: `Nous étudions votre projet et vous rappelons ${callbackDelay} pour en parler avec vous.`,
  },
];
