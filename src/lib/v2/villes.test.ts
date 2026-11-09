import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/config/site.config";
import { MIN_LOCAL_LENGTH, MIN_LOCAL_PARAGRAPHS, VILLES, publishedVilles } from "./villes";

describe("pages par ville", () => {
  it("couvre les communes prioritaires de la config, une adresse chacune", () => {
    expect(VILLES.map((v) => v.name)).toEqual(siteConfig.area.priorityCities);
    const slugs = VILLES.map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("ne publie une ville qu'avec un vrai contenu local", () => {
    for (const ville of VILLES.filter((v) => !v.draft)) {
      expect(ville.local.length).toBeGreaterThanOrEqual(MIN_LOCAL_PARAGRAPHS);
      for (const paragraph of ville.local) {
        expect(paragraph.length).toBeGreaterThanOrEqual(MIN_LOCAL_LENGTH);
      }
    }
    for (const ville of VILLES.filter((v) => v.draft)) {
      const usable =
        ville.local.length >= MIN_LOCAL_PARAGRAPHS &&
        ville.local.every((text) => text.length >= MIN_LOCAL_LENGTH);
      expect(usable).toBe(false);
    }
  });

  it("n'a aucun paragraphe local recopié d'une ville à l'autre", () => {
    const all = VILLES.flatMap((v) => v.local);
    expect(new Set(all).size).toBe(all.length);
  });

  it("le sitemap ne liste que les villes visibles", () => {
    const urls = sitemap()
      .map(({ url }) => url)
      .filter((url) => url.includes("/zones/"));
    expect(urls).toHaveLength(publishedVilles().length);
  });
});
