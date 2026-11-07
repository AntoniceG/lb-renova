import { BrushCleaning, CalendarCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export interface Assurance {
  key: "decennale" | "chantier-propre" | "delais";
  label: string;
  icon: LucideIcon;
}

/** Badges de réassurance choisis par le client (2026-11-07), affichés sous le hero. */
const ALL_ASSURANCES: readonly Assurance[] = [
  { key: "decennale", label: "Garantie décennale", icon: ShieldCheck },
  { key: "chantier-propre", label: "Chantier propre", icon: BrushCleaning },
  { key: "delais", label: "Délais tenus", icon: CalendarCheck },
];

/** La garantie décennale suit l'interrupteur de la config (comme sur le site actuel). */
export const ASSURANCES: readonly Assurance[] = ALL_ASSURANCES.filter(
  ({ key }) => key !== "decennale" || siteConfig.certifications.decennale.enabled,
);
