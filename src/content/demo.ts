/**
 * CONTENU DE DÉMONSTRATION : sert uniquement à valider les gabarits tant que le client n'a pas
 * fourni de photos. Tout ce qui vient d'ici est signalé « Démo » et masqué quand
 * SITE_ENV=production (voir `showDemo`).
 */
import { env } from "@/config/env";

export const showDemo = !env.isProduction;

export interface DemoProject {
  id: string;
  title: string;
  serviceSlug: string;
}

export const demoProjects: DemoProject[] = [
  { id: "demo-1", title: "Dalle et maçonnerie", serviceSlug: "gros-oeuvre" },
  { id: "demo-2", title: "Ouverture d'un mur porteur", serviceSlug: "gros-oeuvre" },
  { id: "demo-3", title: "Installation de climatisation réversible", serviceSlug: "climatisation" },
  { id: "demo-4", title: "Réfection de toiture", serviceSlug: "couverture" },
  { id: "demo-5", title: "Isolation de toiture", serviceSlug: "couverture" },
  { id: "demo-6", title: "Extension en maçonnerie", serviceSlug: "gros-oeuvre" },
];

export interface BeforeAfterImage {
  /** Absent en démo : le gabarit affiche alors un panneau de remplacement. */
  src?: string;
  alt: string;
}

export interface BeforeAfterPair {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

export const demoBeforeAfter: BeforeAfterPair = {
  before: { alt: "Avant les travaux" },
  after: { alt: "Après les travaux" },
};
