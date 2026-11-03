import { Hammer, House, Snowflake, type LucideIcon } from "lucide-react";
import type { IconKey } from "@/config/site.schema";

/** Mapping explicite clé de config → icône : seules les icônes listées ici sont embarquées. */
export const ICONS: Record<IconKey, LucideIcon> = {
  hammer: Hammer,
  snowflake: Snowflake,
  house: House,
};
