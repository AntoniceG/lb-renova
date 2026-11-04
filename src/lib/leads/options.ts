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
  const prefix = siteConfig.brand.name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 3);
  const year = String(new Date(createdAt).getUTCFullYear()).slice(-2);
  return `${prefix}-${year}-${String(refNumber).padStart(4, "0")}`;
}
