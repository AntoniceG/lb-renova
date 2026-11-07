import { getServiceContent, type ServiceContent } from "@/content/services";
import { EXPERTISES } from "./expertises";
import { renovationComplete } from "./renovation-complete";

/** Les trois métiers prioritaires du client : chacun a sa page dédiée (référencement). */
export const PILIER_SLUGS = ["renovation-complete", "gros-oeuvre", "climatisation"] as const;

export interface Pilier {
  slug: string;
  title: string;
  content: ServiceContent;
  metaTitle: string;
  metaDescription: string;
}

/** Les textes du site actuel citent encore Aix-en-Provence seule : sur la V2, la base est Marseille. */
const localize = (text: string) =>
  text.replace("à Aix-en-Provence", "à Marseille et Aix-en-Provence");

export interface Marque {
  name: string;
  src: string;
  width: number;
  height: number;
}

/**
 * Marques affichées sur une page métier. Logos officiels (Wikimedia Commons, « domaine public » côté
 * droit d'auteur, mais MARQUES DÉPOSÉES : à utiliser en respectant la charte de chaque marque).
 * Daikin : DAIKIN_logo.svg ; Mitsubishi Electric : Mitsubishi_Electric_logo.svg.
 */
export const MARQUES: Readonly<Record<string, readonly Marque[]>> = {
  climatisation: [
    { name: "Daikin", src: "/v2/marques/daikin.svg", width: 300, height: 65 },
    {
      name: "Mitsubishi Electric",
      src: "/v2/marques/mitsubishi-electric.svg",
      width: 794,
      height: 242,
    },
  ],
};

export function isPilier(slug: string): boolean {
  return (PILIER_SLUGS as readonly string[]).includes(slug);
}

export function getPilier(slug: string): Pilier | undefined {
  if (!isPilier(slug)) return undefined;
  const title = EXPERTISES.find((expertise) => expertise.slug === slug)?.title;
  const content = slug === "renovation-complete" ? renovationComplete : getServiceContent(slug);
  if (!title || !content) return undefined;
  return {
    slug,
    title,
    content,
    metaTitle: localize(content.metaTitle),
    metaDescription: localize(content.metaDescription),
  };
}

export const PILIERS: readonly Pilier[] = PILIER_SLUGS.flatMap((slug) => getPilier(slug) ?? []);
