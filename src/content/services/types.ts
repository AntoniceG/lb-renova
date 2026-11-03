export interface TitledText {
  title: string;
  text: string;
}

export interface GuideSection {
  title: string;
  paragraphs: string[];
  /** Liste à puces facultative (étapes, points de vigilance). */
  points?: string[];
}

export interface ServiceContent {
  slug: string;
  /** Titre de la page (le gabarit ajoute le nom de la marque) ; reste sous 60 caractères au total. */
  metaTitle: string;
  /** ≤ 155 caractères. */
  metaDescription: string;
  /** Paragraphe d'accroche du mini-hero. */
  lead: string;
  benefits: [TitledText, TitledText, TitledText];
  solutions: TitledText[];
  guides: GuideSection[];
  process: [TitledText, TitledText, TitledText, TitledText];
  faq: { question: string; answer: string }[];
}
