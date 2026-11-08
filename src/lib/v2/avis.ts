export interface Avis {
  id: string;
  /** Prénom et initiale du nom (ou « Prénom et Prénom N. » pour un couple). */
  auteur: string;
  lieu: string;
  chantier: string;
  note: 1 | 2 | 3 | 4 | 5;
  texte: string;
  /** `true` = avis d'exemple, inventé pour la mise en page. Ne doit JAMAIS aller en ligne. */
  fictif: boolean;
}

/**
 * ⚠️ AVIS FICTIFS, À REMPLACER AVANT LA MISE EN LIGNE.
 *
 * Ces cinq avis sont inventés (prénoms et textes d'exemple) pour pouvoir dessiner la section en
 * attendant de vrais témoignages. Garde-fous :
 *   - à la demande du client, aucun bandeau ne l'indique plus sur la page d'aperçu : le seul
 *     rempart est donc le suivant ;
 *   - en production (SITE_ENV=production), la section ne s'affiche pas du tout dès qu'un seul avis
 *     est encore fictif : de faux témoignages ne peuvent pas partir en ligne ;
 *   - aucune donnée structurée (étoiles dans Google) n'est générée à partir d'eux.
 * Pour passer aux vrais avis : remplacer le contenu de ce tableau (prénom, texte, note, lieu, chantier)
 * et mettre `fictif: false`.
 */
export const AVIS: readonly Avis[] = [
  {
    id: "exemple-1",
    auteur: "Sandrine M.",
    lieu: "Marseille 8e",
    chantier: "Rénovation complète",
    note: 5,
    texte:
      "Un seul interlocuteur du début à la fin, des artisans qui se coordonnent sans que j'aie à courir après personne, et une maison propre chaque soir. Les délais ont été tenus.",
    fictif: true,
  },
  {
    id: "exemple-2",
    auteur: "Karim B.",
    lieu: "Aix-en-Provence",
    chantier: "Climatisation",
    note: 5,
    texte:
      "Climatisation posée proprement, avec des explications claires sur le fonctionnement. Rien à redire.",
    fictif: true,
  },
  {
    id: "exemple-3",
    auteur: "Nathalie et Éric R.",
    lieu: "Marseille 12e",
    chantier: "Gros œuvre",
    note: 5,
    texte: "Ouverture d'un mur porteur et extension : sérieux, conseils justes, devis respecté.",
    fictif: true,
  },
  {
    id: "exemple-4",
    auteur: "Julien P.",
    lieu: "Allauch",
    chantier: "Façade",
    note: 5,
    texte: "Façade refaite à neuf, le résultat est superbe. Équipe ponctuelle et discrète.",
    fictif: true,
  },
  {
    id: "exemple-5",
    auteur: "Marion T.",
    lieu: "Marseille 6e",
    chantier: "Salle de bain",
    note: 5,
    texte:
      "Plomberie, carrelage et peinture gérés par la même équipe : un vrai gain de temps, et un résultat soigné.",
    fictif: true,
  },
];
