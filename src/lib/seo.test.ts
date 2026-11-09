import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { publishedArticles } from "@/lib/v2/articles";
import { FAQ } from "@/lib/v2/faq";
import { articleJsonLd, businessJsonLd, faqJsonLd, pageMetadata, websiteJsonLd } from "./seo";

describe("faqJsonLd", () => {
  it("reprend exactement les questions affichées", () => {
    const data = faqJsonLd(FAQ);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(FAQ.length);
    const [first] = FAQ;
    if (!first) throw new Error("La FAQ est vide.");
    expect(data.mainEntity[0]).toEqual({
      "@type": "Question",
      name: first.question,
      acceptedAnswer: { "@type": "Answer", text: first.reponse },
    });
  });
});

describe("articleJsonLd", () => {
  const base = {
    headline: "T",
    description: "D",
    path: "/articles/x",
    datePublished: "2026-11-07",
  };

  it("utilise la date de publication quand l'article n'a pas été révisé", () => {
    expect(articleJsonLd(base).dateModified).toBe("2026-11-07");
  });

  it("utilise la date de révision quand elle existe", () => {
    expect(articleJsonLd({ ...base, dateModified: "2027-01-15" }).dateModified).toBe("2027-01-15");
  });
});

describe("fiche entreprise", () => {
  const data = businessJsonLd();

  it("transmet l'adresse du siège", () => {
    expect(data.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "Chemin du plan du port",
      postalCode: "83400",
      addressLocality: "Hyères",
      addressCountry: "FR",
    });
  });

  it("ne contient ni note ni avis (aucun avis réel)", () => {
    const json = JSON.stringify(data);
    expect(json).not.toMatch(/aggregateRating|"review"|ratingValue/);
  });

  it("le site pointe vers l'entreprise", () => {
    expect(websiteJsonLd().publisher).toEqual({ "@id": data["@id"] });
  });
});

describe("pageMetadata", () => {
  it("pose l'adresse canonique et les dates d'un article", () => {
    const meta = pageMetadata({
      title: "T",
      description: "D",
      path: "/articles/x",
      type: "article",
      publishedTime: "2026-11-07",
      modifiedTime: "2027-01-15",
    });
    expect(meta.alternates?.canonical).toBe("/articles/x");
    expect(meta.openGraph).toMatchObject({
      publishedTime: "2026-11-07",
      modifiedTime: "2027-01-15",
    });
  });

  it("ferme la page aux moteurs avec noindex", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/merci", noindex: true });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});

describe("articles", () => {
  it.each(publishedArticles().map((a) => [a.slug, a] as const))(
    "%s : dates valides et description dans la limite",
    (_slug, article) => {
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (article.updated) {
        expect(article.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(article.updated >= article.date).toBe(true);
      }
      expect(article.description.length).toBeLessThanOrEqual(155);
    },
  );
});

describe("sitemap", () => {
  const urls = sitemap().map(({ url }) => url);

  it("contient l'accueil, les métiers et le devis", () => {
    for (const path of ["", "/renovation-complete", "/gros-oeuvre", "/climatisation", "/devis"]) {
      expect(urls.some((url) => url.endsWith(path) && !url.endsWith(`${path}/`))).toBe(true);
    }
  });

  it("exclut les pages jamais montrées dans Google", () => {
    expect(urls.some((url) => /\/(merci|eau)$/.test(url))).toBe(false);
  });

  it("n'a aucun doublon", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const load = async (siteEnv: string) => {
    vi.resetModules();
    vi.stubEnv("SITE_ENV", siteEnv);
    return (await import("@/app/robots")).default();
  };

  it("bloque tout hors production", async () => {
    expect((await load("preview")).rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("autorise le site en production et pointe vers le sitemap", async () => {
    const robots = await load("production");
    expect(robots.sitemap).toMatch(/\/sitemap\.xml$/);
    expect(robots.rules).toMatchObject({ userAgent: "*", allow: "/" });
    // Aucune règle propre à un robot d'IA : ils suivent le groupe « * ».
    expect(Array.isArray(robots.rules)).toBe(false);
  });
});
