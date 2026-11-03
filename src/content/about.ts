export interface TeamMember {
  name: string;
  role: string;
  /** Chemin public de la photo ; sans photo, seules les initiales sont affichées. */
  photo?: string;
  bio?: string;
}

/**
 * Récit de la page « Qui sommes-nous » : uniquement des faits fournis par le client.
 * Le texte complet viendra de sa part ; ces paragraphes servent de base en attendant.
 */
export const aboutContent = {
  paragraphs: [
    "Tout commence avec un grand-père venu d'Italie. Arrivé en France comme tailleur de pierre, il a fait de la pierre son métier et de l'exigence du travail bien fait sa façon de travailler.",
    "Ce savoir-faire s'est transmis au sein de la famille. Aujourd'hui, ses petits-enfants sont maçons au sein de l'entreprise : ils perpétuent le geste, le soin du détail et le respect de la matière.",
  ],
  today: {
    title: "Un seul interlocuteur, un spécialiste par métier",
    paragraphs: [
      "L'entreprise réunit trois spécialités : le gros œuvre, la climatisation et la couverture. Chaque corps de métier est porté par un spécialiste de l'entreprise, ce qui vous donne un seul interlocuteur pour l'ensemble de votre projet de rénovation.",
    ],
  },
  /** Équipe : masquée tant qu'elle est vide. À renseigner avec noms, rôles et photos réels. */
  team: [] as TeamMember[],
} as const;
