import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site.config";
import { contrastRatio } from "@/lib/contrast";

const white = "oklch(1 0 0)";
const { colors } = siteConfig.brand;

// WCAG 2.2 AA : 4.5:1 pour le texte courant, 3:1 pour le grand texte et les composants d'interface.
const textPairs: [string, string, string][] = [
  ["texte courant sur blanc", colors.ink, white],
  ["texte secondaire sur blanc", colors.muted, white],
  ["texte secondaire sur surface", colors.muted, colors.surface],
  ["lien bleu sur blanc", colors.blue, white],
  ["rouge texte sur blanc", colors.redInk, white],
  ["blanc sur marine", white, colors.navy],
  ["blanc sur marine profond", white, colors.navyDeep],
  ["blanc sur bouton CTA", white, colors.red],
  ["blanc sur bouton CTA (hover)", white, colors.redHover],
];

describe("contrastes de la palette (AA)", () => {
  it.each(textPairs)("%s ≥ 4.5:1", (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("la bordure reste visible contre le blanc comme composant (≥ 1.1:1, décoratif)", () => {
    expect(contrastRatio(colors.line, white)).toBeGreaterThanOrEqual(1.1);
  });
});
