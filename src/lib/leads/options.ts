import { siteConfig } from "@/config/site.config";

export interface ProjectTypeOption {
  value: string;
  label: string;
}

/** Types de projet proposés : « Rénovation globale », chaque spécialité de la config, « Autre ». */
export function getProjectTypeOptions(): ProjectTypeOption[] {
  return [
    { value: "renovation-globale", label: "Rénovation globale" },
    ...siteConfig.services.map((service) => ({ value: service.slug, label: service.title })),
    { value: "autre", label: "Autre projet" },
  ];
}

export function getProjectTypeLabel(value: string): string {
  return getProjectTypeOptions().find((option) => option.value === value)?.label ?? value;
}

/** Référence lisible d'un lead : LB-26-0042 (initiales de la marque, année, numéro). */
export function formatLeadRef(refNumber: number, createdAt: string | Date): string {
  // Premier mot de la marque (« LB Rénova » → LB), limité à 3 lettres.
  const prefix = (siteConfig.brand.name.split(/\s+/)[0] ?? "REF")
    .normalize("NFD")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 3);
  const year = String(new Date(createdAt).getUTCFullYear()).slice(-2);
  return `${prefix}-${year}-${String(refNumber).padStart(4, "0")}`;
}
