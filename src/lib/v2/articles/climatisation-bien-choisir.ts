import { getPhoto } from "../realisations";
import type { Article } from "./types";

/**
 * PUBLIÉ le 2026-11-07 à la demande du client. Texte rédigé par l'assistant, à relire par un professionnel du métier. Il reprend les
 * explications de la page Climatisation du site actuel, sans chiffre ni règle précise.
 */
export const climatisationBienChoisir: Article = {
  slug: "climatisation-reversible-bien-choisir",
  title: "Climatisation réversible : comment bien choisir ?",
  description:
    "Puissance, type d'unité, emplacement, entretien : les points à regarder avant d'installer une climatisation réversible chez soi.",
  date: "2026-11-07",
  category: "Climatisation",
  pilier: "climatisation",
  cover: getPhoto(16),
  draft: false,
  blocks: [
    {
      type: "p",
      text: "Une climatisation réversible rafraîchit l'été et chauffe à la mi-saison : c'est une pompe à chaleur air-air. Bien la choisir évite deux défauts classiques, l'appareil trop puissant ou, au contraire, trop juste. Voici les points à regarder avant de décider.",
    },
    { type: "h2", text: "La puissance ne dépend pas que de la surface" },
    {
      type: "p",
      text: "La puissance d'un climatiseur s'exprime en kilowatts. Elle dépend de la surface à traiter, mais aussi de la hauteur sous plafond, de l'isolation, de la taille et de l'orientation des vitrages, et du nombre de personnes qui occupent la pièce. Dans le Sud, une pièce plein sud très vitrée n'a pas les mêmes besoins qu'une chambre orientée au nord.",
    },
    {
      type: "p",
      text: "Un appareil surdimensionné n'est pas un avantage : il s'arrête dès que la température est atteinte, redémarre sans cesse et déshumidifie mal, ce qui donne une sensation d'air froid mais moite. Un appareil sous-dimensionné tourne en permanence sans y parvenir. L'objectif est la juste puissance, choisie après avoir vu les pièces.",
    },
    { type: "h2", text: "Monosplit, multisplit, gainable : quel type d'unité ?" },
    {
      type: "p",
      text: "Le monosplit relie une unité extérieure à une seule unité intérieure, idéal pour une pièce de vie. Le multisplit relie une unité extérieure à plusieurs unités intérieures, pour rafraîchir plusieurs pièces avec un seul groupe en façade. Le gainable cache l'appareil dans un faux plafond ou des combles et diffuse l'air par des bouches : il convient aux rénovations lourdes où l'on ne veut voir aucun appareil.",
    },
    {
      type: "ul",
      items: [
        "Unité murale : le choix de la plupart des pièces",
        "Console près du sol : quand le mur est peu disponible",
        "Cassette au plafond : pour une grande pièce",
        "Gainable : pour une installation invisible",
      ],
    },
    { type: "h2", text: "Où placer les unités ?" },
    {
      type: "p",
      text: "L'unité extérieure se voit et s'entend. Placez-la à distance des fenêtres voisines, sur des supports anti-vibratiles. En copropriété, le règlement peut encadrer son installation en façade ou sur un balcon, et une autorisation de l'assemblée générale peut être nécessaire. À l'intérieur, l'emplacement de l'unité conditionne la circulation de l'air : on évite de souffler directement sur un lit ou un fauteuil.",
    },
    { type: "h2", text: "Confier la pose à un professionnel" },
    {
      type: "p",
      text: "La manipulation des fluides frigorigènes est réglementée : elle est réservée aux professionnels disposant de l'attestation de capacité requise. Le circuit doit être tiré au vide et contrôlé à l'installation, puis entretenu régulièrement.",
    },
    { type: "h2", text: "L'entretien au quotidien" },
    {
      type: "ul",
      items: [
        "Nettoyer régulièrement les filtres des unités intérieures",
        "Faire contrôler l'installation périodiquement par un professionnel",
        "Dégager l'unité extérieure (feuilles, végétation)",
      ],
    },
    {
      type: "p",
      text: "Le bon réflexe avant d'acheter : faire visiter les pièces. Surfaces, vitrages, orientation et passages possibles pour les liaisons se jugent sur place, pas sur un catalogue.",
    },
  ],
};
