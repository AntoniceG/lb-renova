import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site.config";
import { collectText, getServiceContent, serviceContents } from "./index";

const wordCount = (texts: string[]) => texts.join(" ").split(/\s+/).filter(Boolean).length;

describe("contenus des pages métiers", () => {
  it("couvre exactement les spécialités de la config", () => {
    expect(serviceContents.map((c) => c.slug).sort()).toEqual(
      siteConfig.services.map((s) => s.slug).sort(),
    );
  });

  it.each(serviceContents.map((c) => [c.slug, c] as const))(
    "%s : au moins 800 mots utiles",
    (_slug, content) => {
      expect(wordCount(collectText(content))).toBeGreaterThanOrEqual(800);
    },
  );

  it.each(serviceContents.map((c) => [c.slug, c] as const))(
    "%s : métadonnées dans les limites SEO",
    (_slug, content) => {
      const title = `${content.metaTitle} | ${siteConfig.brand.name}`;
      expect(title.length).toBeLessThanOrEqual(60);
      expect(content.metaDescription.length).toBeLessThanOrEqual(155);
    },
  );

  it("n'évoque aucune aide financière ni prix chiffré", () => {
    const text = serviceContents.flatMap(collectText).join(" ").toLowerCase();
    expect(text).not.toMatch(/maprimerenov|prime renov|éco-ptz|cee\b|aide de l'état/);
    expect(text).not.toMatch(/\d\s?(€|euros?)/);
  });

  it("retrouve un contenu par slug", () => {
    expect(getServiceContent("couverture")?.slug).toBe("couverture");
    expect(getServiceContent("inconnu")).toBeUndefined();
  });
});
