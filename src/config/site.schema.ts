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
    address: z.object({
      street: orTodo(z.string().min(2)),
      postalCode: orTodo(z.string().regex(/^\d{5}$/)),
      city: orTodo(z.string().min(2)),
    }),
    hours: orTodo(z.string().min(2)),
    googleBusinessUrl: orTodo(z.url()),
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
    decennale: z.object({ enabled: z.boolean(), insurer: orTodo(z.string().min(2)) }),
  }),
  services: z.array(serviceSchema).min(1),
  nav: z.object({
    servicesLabel: z.string(),
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
