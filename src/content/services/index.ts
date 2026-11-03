import { climatisation } from "./climatisation";
import { couverture } from "./couverture";
import { grosOeuvre } from "./gros-oeuvre";
import type { ServiceContent } from "./types";

export type { GuideSection, ServiceContent, TitledText } from "./types";

export const serviceContents: ServiceContent[] = [grosOeuvre, climatisation, couverture];

export function getServiceContent(slug: string): ServiceContent | undefined {
  return serviceContents.find((content) => content.slug === slug);
}

/** Tous les textes affichés sur une page métier, pour contrôler le volume éditorial. */
export function collectText(content: ServiceContent): string[] {
  return [
    content.lead,
    ...content.benefits.flatMap((b) => [b.title, b.text]),
    ...content.solutions.flatMap((s) => [s.title, s.text]),
    ...content.guides.flatMap((g) => [g.title, ...g.paragraphs, ...(g.points ?? [])]),
    ...content.process.flatMap((p) => [p.title, p.text]),
    ...content.faq.flatMap((f) => [f.question, f.answer]),
  ];
}
