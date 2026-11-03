import type { CSSProperties } from "react";
import type { BrandColors } from "@/config/site.schema";

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Injecte la palette de la config comme variables CSS (`--navy`, `--navy-deep`…) sur <html>. */
export function brandCssVars(colors: BrandColors): CSSProperties {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) vars[`--${kebab(key)}`] = value;
  return vars as CSSProperties;
}

/** Lien `tel:` ; `#` tant que le numéro est une constante TODO_. */
export function telHref(e164: string): string {
  return e164.startsWith("+") ? `tel:${e164}` : "#";
}
