import type { LucideIcon } from "lucide-react";
import { UI_ICONS } from "@/components/ui/icons";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";

export interface ReassuranceItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

/** Puces de réassurance : uniquement des engagements réels et activés dans la config. */
export function getReassuranceItems(): ReassuranceItem[] {
  const { certifications, promise } = siteConfig;
  const items: ReassuranceItem[] = [
    { key: "quote", label: "Devis gratuit, sans engagement", icon: UI_ICONS.quote },
  ];
  if (certifications.decennale.enabled) {
    items.push({ key: "decennale", label: "Assurance décennale", icon: UI_ICONS.shield });
  }
  if (certifications.rge.enabled) {
    items.push({ key: "rge", label: "Qualifié RGE", icon: UI_ICONS.badge });
  }
  items.push({
    key: "specialist",
    label: "Un spécialiste par corps de métier",
    icon: UI_ICONS.specialist,
  });
  if (!isTodo(promise.callbackDelay)) {
    items.push({ key: "callback", label: `Rappel ${promise.callbackDelay}`, icon: UI_ICONS.phone });
  }
  return items;
}

/** Bandeau sous le hero. */
export function ReassuranceBand() {
  const items = getReassuranceItems();
  return (
    <section
      aria-label="Nos engagements"
      className="hidden border-b border-line bg-surface md:block"
    >
      <ul className="container-page flex flex-wrap justify-center gap-x-10 gap-y-3 py-5">
        {items.map(({ key, label, icon: Icon }) => (
          <li key={key} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <Icon aria-hidden className="size-5 text-navy" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
