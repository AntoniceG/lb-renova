import {
  BadgeCheck,
  ClipboardList,
  Hammer,
  House,
  Phone,
  ShieldCheck,
  Snowflake,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/config/site.schema";

/** Mapping explicite clé de config → icône : seules les icônes listées ici sont embarquées. */
export const ICONS: Record<IconKey, LucideIcon> = {
  hammer: Hammer,
  snowflake: Snowflake,
  house: House,
};

/** Icônes d'interface (réassurance, garanties) utilisées par les sections. */
export const UI_ICONS = {
  shield: ShieldCheck,
  badge: BadgeCheck,
  quote: ClipboardList,
  specialist: UserRoundCheck,
  phone: Phone,
} satisfies Record<string, LucideIcon>;
