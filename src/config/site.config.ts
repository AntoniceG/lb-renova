import { env } from "./env";
import { defineSiteConfig, todo } from "./site.schema";

/**
 * SEUL fichier à modifier pour réutiliser le template sur une autre entreprise.
 * Les valeurs `todo(...)` sont listées dans TODO_CLIENT.md ; le build de production
 * (SITE_ENV=production) échoue tant qu'il en reste.
 */
export const siteConfig = defineSiteConfig(
  {
    brand: {
      name: "LB Rénova",
      legalName: todo("LEGAL_NAME"),
      tagline: "Rénover • Bâtir • Valoriser",
      description:
        "Rénovation complète, gros œuvre et climatisation à Marseille et Aix-en-Provence. Entreprise familiale, devis gratuit.",
      // Palette provisoire (bleu-blanc-rouge), à recalibrer sur le logo final. Valeurs en oklch.
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
      phone: { display: "06 61 60 92 10", e164: "+33661609210" },
      email: todo("EMAIL"),
      address: {
        street: todo("ADDRESS_STREET"),
        postalCode: todo("ADDRESS_POSTAL_CODE"),
        city: todo("ADDRESS_CITY"),
      },
      // Facultatifs (voir site.schema.ts) : `hours`, `googleBusinessUrl` (lien de la fiche Google Business).
    },
    area: {
      baseCity: "Marseille",
      radiusKm: 50,
      priorityCities: ["Marseille", "Aix-en-Provence", "Gardanne", "Salon-de-Provence", "Pertuis"],
    },
    certifications: {
      rge: { enabled: false },
      decennale: { enabled: true, insurer: todo("INSURER") },
    },
    legal: {
      legalForm: todo("LEGAL_FORM"),
      capital: todo("CAPITAL"),
      siret: todo("SIRET"),
      registration: todo("REGISTRATION"),
      vat: todo("VAT"),
      publicationDirector: todo("PUBLICATION_DIRECTOR"),
      mediator: { name: todo("MEDIATOR_NAME"), url: todo("MEDIATOR_URL") },
      insurerAddress: todo("INSURER_ADDRESS"),
      insuranceCoverage: todo("INSURANCE_COVERAGE"),
      host: {
        name: "Vercel Inc.",
        address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
        website: "https://vercel.com",
        // Seul le numéro n'est pas vérifié (une source tierce donne un numéro, à confirmer sur vercel.com/contact).
        phone: todo("HOST_PHONE"),
      },
    },
    promise: { callbackDelay: "sous 48 h" },
    story: {
      since: 1945,
      title: "Une histoire de famille",
      teaser:
        "Tout commence avec un grand-père venu d'Italie, tailleur de pierre. Aujourd'hui, ses petits-enfants, maçons au sein de l'entreprise, perpétuent ce métier et la même exigence du travail bien fait.",
    },
    services: [
      {
        slug: "gros-oeuvre",
        title: "Gros œuvre",
        iconKey: "hammer",
        intro: "Dalles, ouverture de murs porteurs, maçonnerie, extensions.",
        highlights: ["Dalles", "Ouverture de murs porteurs", "Maçonnerie", "Extensions"],
        keywords: ["gros œuvre", "maçonnerie", "ouverture mur porteur", "extension"],
      },
      {
        slug: "climatisation",
        title: "Climatisation",
        iconKey: "snowflake",
        intro: "Installation et remplacement de climatisation réversible, pompe à chaleur air-air.",
        highlights: [
          "Installation",
          "Remplacement",
          "Climatisation réversible",
          "Pompe à chaleur air-air",
        ],
        keywords: ["climatisation", "clim réversible", "pompe à chaleur air-air"],
      },
      {
        slug: "couverture",
        title: "Couverture",
        iconKey: "house",
        intro: "Toiture, réfection, isolation de toiture et zinguerie.",
        highlights: ["Toiture", "Réfection", "Isolation de toiture", "Zinguerie"],
        keywords: ["couverture", "toiture", "réfection toiture", "zinguerie"],
      },
    ],
    nav: {
      servicesLabel: "Nos spécialités",
      links: [{ label: "Qui sommes-nous", href: "/qui-sommes-nous" }],
      quoteLabel: "Devis gratuit",
      quoteHref: "/devis",
      callLabel: "Appeler",
    },
  },
  { production: env.isProduction },
);
