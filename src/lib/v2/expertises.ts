import {
  BrickWall,
  Building,
  Droplets,
  Grid3x3,
  Hammer,
  House,
  Layers,
  PaintRoller,
  Shovel,
  Snowflake,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site.config";

export interface Expertise {
  slug: string;
  title: string;
  icon: LucideIcon;
  /** Mise en avant (grande carte) : les métiers prioritaires choisis par le client. */
  featured: boolean;
  description?: string;
}

/** Texte déjà validé dans la config du site actuel : une seule source pour ces descriptions. */
const configIntro = (slug: string) =>
  siteConfig.services.find((service) => service.slug === slug)?.intro;

/**
 * Liste fournie par le client (2026-11-07). Les trois premiers sont les métiers prioritaires.
 * Les autres suivent l'ordre d'un chantier, du terrassement à la peinture.
 * Seuls les métiers prioritaires ont une description : rien n'est inventé pour les autres.
 */
export const EXPERTISES: readonly Expertise[] = [
  {
    slug: "renovation-complete",
    title: "Rénovation complète",
    icon: Hammer,
    featured: true,
    description:
      "Du projet à la dernière finition, un seul interlocuteur pour l'ensemble de votre chantier.",
  },
  {
    slug: "gros-oeuvre",
    title: "Gros œuvre",
    icon: BrickWall,
    featured: true,
    description: configIntro("gros-oeuvre"),
  },
  {
    slug: "climatisation",
    title: "Climatisation",
    icon: Snowflake,
    featured: true,
    description: configIntro("climatisation"),
  },
  { slug: "terrassement", title: "Terrassement", icon: Shovel, featured: false },
  { slug: "facade", title: "Façade", icon: Building, featured: false },
  { slug: "couverture", title: "Couverture", icon: House, featured: false },
  { slug: "electricite", title: "Électricité", icon: Zap, featured: false },
  { slug: "plomberie", title: "Plomberie", icon: Droplets, featured: false },
  { slug: "placo", title: "Placo", icon: Layers, featured: false },
  { slug: "carrelage", title: "Carrelage", icon: Grid3x3, featured: false },
  { slug: "peinture", title: "Peinture", icon: PaintRoller, featured: false },
];

/** Textes de la section. BROUILLON à faire valider par le client. */
export const EXPERTISES_COPY = {
  eyebrow: "Savoir-faire",
  titleLead: "Nos",
  titleEmphasis: "expertises",
  lead: "Chaque étape de votre chantier, du terrassement à la peinture.",
} as const;
