import { describe, expect, it } from "vitest";
import {
  defineSiteConfig,
  findTodos,
  siteConfigSchema,
  todo,
  type SiteConfigInput,
} from "./site.schema";

function validInput(): SiteConfigInput {
  return {
    brand: {
      name: "Test Rénova",
      legalName: "Test Rénova SAS",
      tagline: "Une baseline",
      description: "Une description suffisamment longue pour passer la validation du schéma.",
      colors: {
        navy: "oklch(0.27 0.07 262)",
        navyDeep: "oklch(0.2 0.06 262)",
        blue: "oklch(0.48 0.14 262)",
        sky: "oklch(0.95 0.02 255)",
        red: "oklch(0.55 0.21 27)",
        redHover: "oklch(0.49 0.2 27)",
        redInk: "oklch(0.5 0.19 27)",
        ink: "oklch(0.22 0.04 262)",
        muted: "oklch(0.46 0.03 262)",
        surface: "oklch(0.975 0.006 255)",
        line: "oklch(0.91 0.01 255)",
      },
    },
    contact: {
      phone: { display: "04 00 00 00 00", e164: "+33400000000" },
      email: "contact@example.fr",
      address: { street: "1 rue Test", postalCode: "13100", city: "Aix-en-Provence" },
      hours: "Lun-Ven 8h-18h",
      googleBusinessUrl: "https://maps.example.com/test",
    },
    area: { baseCity: "Aix-en-Provence", radiusKm: 50, priorityCities: ["Aix-en-Provence"] },
    certifications: {
      rge: { enabled: false },
      decennale: { enabled: true, insurer: "Assureur Test" },
    },
    services: [
      {
        slug: "gros-oeuvre",
        title: "Gros œuvre",
        iconKey: "hammer",
        intro: "Une introduction de service.",
        keywords: ["gros œuvre"],
      },
    ],
    nav: {
      servicesLabel: "Spécialités",
      quoteLabel: "Devis",
      quoteHref: "/#devis",
      callLabel: "Appeler",
    },
  };
}

describe("siteConfigSchema", () => {
  it("accepte une config complète", () => {
    expect(() => defineSiteConfig(validInput(), { production: true })).not.toThrow();
  });

  it("accepte des constantes TODO_ hors production", () => {
    const input = validInput();
    input.contact.phone = { display: todo("PHONE"), e164: todo("PHONE_E164") };
    input.contact.email = todo("EMAIL");
    expect(() => defineSiteConfig(input, { production: false })).not.toThrow();
  });

  it("refuse les TODO_ en production et liste les chemins concernés", () => {
    const input = validInput();
    input.contact.phone = { display: todo("PHONE"), e164: "+33400000000" };
    input.certifications.decennale.insurer = todo("INSURER");
    expect(() => defineSiteConfig(input, { production: true })).toThrowError(
      /2 donnée\(s\)[\s\S]*contact\.phone\.display[\s\S]*certifications\.decennale\.insurer/,
    );
  });

  it("refuse un email invalide qui n'est pas une constante TODO_", () => {
    const input = validInput();
    input.contact.email = "pas-un-email";
    expect(siteConfigSchema.safeParse(input).success).toBe(false);
  });

  it("refuse une couleur hors oklch", () => {
    const input = validInput();
    input.brand.colors.navy = "#112244";
    expect(siteConfigSchema.safeParse(input).success).toBe(false);
  });

  it("refuse une description hors limite SEO (> 155 caractères)", () => {
    const input = validInput();
    input.brand.description = "x".repeat(156);
    expect(siteConfigSchema.safeParse(input).success).toBe(false);
  });
});

describe("findTodos", () => {
  it("parcourt objets et tableaux imbriqués", () => {
    expect(findTodos({ a: { b: todo("X") }, c: ["ok", todo("Y")] })).toEqual(["a.b", "c[1]"]);
  });
});
