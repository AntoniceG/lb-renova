import { z } from "zod";

export const TODO_PREFIX = "TODO_";

/** Constante de donnée manquante, visible à l'écran en preview, bloquante en production. */
export function todo(label: string): `TODO_${string}` {
  return `${TODO_PREFIX}${label}`;
}

export function isTodo(value: string): boolean {
  return value.startsWith(TODO_PREFIX);
}

const todoString = z.string().startsWith(TODO_PREFIX);
const orTodo = <T extends z.ZodType<string>>(schema: T) => z.union([todoString, schema]);

/** Clés d'icônes autorisées : mappées explicitement dans `components/ui/icons.ts`. */
export const ICON_KEYS = ["hammer", "snowflake", "house"] as const;
export type IconKey = (typeof ICON_KEYS)[number];

const oklchColor = z.string().regex(/^oklch\(.+\)$/, "couleur oklch(...) attendue");

const brandColorsSchema = z.object({
  navy: oklchColor,
  navyDeep: oklchColor,
  blue: oklchColor,
  sky: oklchColor,
  red: oklchColor,
  redHover: oklchColor,
  redInk: oklchColor,
  ink: oklchColor,
  muted: oklchColor,
  surface: oklchColor,
  line: oklchColor,
});
export type BrandColors = z.infer<typeof brandColorsSchema>;

const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  iconKey: z.enum(ICON_KEYS),
  intro: z.string().min(10),
  /** Prestations réellement proposées, affichées en puces. */
  highlights: z.array(z.string().min(2)).min(1),
  keywords: z.array(z.string()).min(1),
});
export type ServiceConfig = z.infer<typeof serviceSchema>;

export const siteConfigSchema = z.object({
  brand: z.object({
    name: z.string().min(2),
    legalName: orTodo(z.string().min(2)),
    tagline: z.string().min(2),
    description: z.string().min(20).max(155),
    colors: brandColorsSchema,
  }),
  contact: z.object({
    phone: z.object({
      display: orTodo(z.string().min(6)),
      /** Format international sans espaces, ex. +33442000000 */
      e164: orTodo(z.string().regex(/^\+\d{9,15}$/)),
    }),
    email: orTodo(z.email()),
    whatsapp: orTodo(z.string().regex(/^\+\d{9,15}$/)).optional(),
    /** Adresse du siège : facultative (la ligne n'apparaît que si elle est renseignée). */
    address: z
      .object({
        street: orTodo(z.string().min(2)),
        postalCode: orTodo(z.string().regex(/^\d{5}$/)),
        city: orTodo(z.string().min(2)),
      })
      .optional(),
    /** Horaires : facultatif (n'est affiché nulle part pour l'instant). */
    hours: orTodo(z.string().min(2)).optional(),
    /** Fiche Google Business : facultatif ; s'il est renseigné, il est transmis à Google (schema.org `sameAs`). */
    googleBusinessUrl: orTodo(z.url()).optional(),
  }),
  area: z.object({
    baseCity: z.string().min(2),
    radiusKm: z.number().int().positive(),
    /** Communes prioritaires : base des pages /zones/[city]. */
    priorityCities: z.array(z.string().min(2)).min(1),
  }),
  certifications: z.object({
    /** Badge de réassurance seul. À n'activer que si la qualification est réellement détenue. */
    rge: z.object({ enabled: z.boolean() }),
    decennale: z.object({
      enabled: z.boolean(),
      /** Assureur : facultatif (la ligne n'apparaît que s'il est renseigné). */
      insurer: orTodo(z.string().min(2)).optional(),
      /** Lien vers l'attestation PDF ; le bouton de téléchargement n'apparaît que s'il est renseigné. */
      attestationUrl: z.string().startsWith("/").optional(),
    }),
  }),
  /**
   * Informations des mentions légales. Une ligne facultative absente n'apparaît pas sur la page ;
   * une valeur obligatoire encore en `TODO_` s'y affiche en surligné.
   */
  legal: z.object({
    /** Forme juridique : « SARL », « SAS », « Entreprise individuelle »… */
    legalForm: orTodo(z.string().min(2)),
    /** Capital social, ex. « 10 000 € ». Retirer la clé pour une entreprise individuelle. */
    capital: orTodo(z.string().min(2)).optional(),
    /** SIRET (14 chiffres) ou SIREN (9 chiffres), espaces permis ; l'intitulé affiché suit la longueur. */
    siret: orTodo(z.string().regex(/^(?:\d ?){14}$|^(?:\d ?){9}$/)),
    /** Immatriculation : « RCS Marseille 123 456 789 », « RM Bouches-du-Rhône »… */
    registration: orTodo(z.string().min(2)).optional(),
    /** N° de TVA intracommunautaire, ou la mention de franchise en base de TVA. */
    vat: orTodo(z.string().min(2)).optional(),
    publicationDirector: orTodo(z.string().min(2)),
    /** Médiateur de la consommation (obligatoire pour les particuliers). */
    mediator: z.object({ name: orTodo(z.string().min(2)), url: orTodo(z.url()) }).optional(),
    /** Assurance décennale : adresse de l'assureur et zone couverte (ex. « France métropolitaine »). */
    insurerAddress: orTodo(z.string().min(5)).optional(),
    insuranceCoverage: orTodo(z.string().min(2)).optional(),
    host: z.object({
      name: z.string().min(2),
      address: z.string().min(5),
      website: z.url(),
      phone: orTodo(z.string().min(6)).optional(),
    }),
  }),
  promise: z.object({
    /** Délai de rappel que l'équipe s'engage à tenir (ex. « sous 24 h ouvrées »). */
    callbackDelay: orTodo(z.string().min(2)),
  }),
  story: z.object({
    /** Année d'origine du savoir-faire familial (jamais présentée comme date de fondation). */
    since: z.number().int().min(1800).max(2100),
    title: z.string().min(2),
    teaser: z.string().min(20),
  }),
  services: z.array(serviceSchema).min(1),
  nav: z.object({
    servicesLabel: z.string(),
    /** Liens simples du menu, après la liste des spécialités. */
    links: z.array(z.object({ label: z.string(), href: z.string().startsWith("/") })),
    quoteLabel: z.string(),
    quoteHref: z.string().startsWith("/"),
    callLabel: z.string(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;

/** Chemins (ex. `contact.phone.display`) de toutes les valeurs encore à compléter. */
export function findTodos(value: unknown, path = ""): string[] {
  if (typeof value === "string") return isTodo(value) ? [path] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findTodos(v, `${path}[${i}]`));
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findTodos(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Valide la config ; en production, refuse toute constante `TODO_` restante. */
export function defineSiteConfig(
  input: SiteConfigInput,
  options: { production: boolean },
): SiteConfig {
  const config = siteConfigSchema.parse(input);
  if (options.production) {
    const pending = findTodos(config);
    if (pending.length > 0) {
      throw new Error(
        `site.config.ts : ${pending.length} donnée(s) à compléter avant la mise en production :\n- ${pending.join("\n- ")}`,
      );
    }
  }
  return config;
}
