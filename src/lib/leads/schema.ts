import { z } from "zod";
import { normalizeFrenchPhone } from "./phone";

export const PROPERTY_TYPES = ["maison", "appartement", "immeuble", "local", "autre"] as const;
export const OCCUPANCIES = ["proprietaire", "locataire", "autre"] as const;
export const TIMELINES = ["urgent", "1-3-mois", "3-6-mois", "plus-tard", "information"] as const;
export const CALL_SLOTS = ["matin", "apres-midi", "soir", "peu-importe"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type Occupancy = (typeof OCCUPANCIES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type CallSlot = (typeof CALL_SLOTS)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  maison: "Maison",
  appartement: "Appartement",
  immeuble: "Immeuble",
  local: "Local professionnel",
  autre: "Autre",
};

export const OCCUPANCY_LABELS: Record<Occupancy, string> = {
  proprietaire: "Propriétaire",
  locataire: "Locataire",
  autre: "Autre situation",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  urgent: "Dès que possible",
  "1-3-mois": "Dans 1 à 3 mois",
  "3-6-mois": "Dans 3 à 6 mois",
  "plus-tard": "Dans plus de 6 mois",
  information: "Je me renseigne pour l'instant",
};

export const CALL_SLOT_LABELS: Record<CallSlot, string> = {
  matin: "Le matin",
  "apres-midi": "L'après-midi",
  soir: "En fin de journée",
  "peu-importe": "Peu importe",
};

/** Version du texte d'information RGPD affiché au visiteur ; à incrémenter si le texte change. */
export const CONSENT_VERSION = "2026-11-v1";

/**
 * Schémas du devis. Les types de projet autorisés viennent de la config du site : ils sont
 * donc passés en paramètre. Les mêmes schémas valident chaque étape (navigateur) et la
 * soumission finale (serveur).
 */
export function createLeadSchemas(projectTypes: readonly string[]) {
  const project = z.object({
    projectType: z.string().refine((value) => projectTypes.includes(value), {
      error: "Choisissez le type de projet.",
    }),
    postalCode: z
      .string()
      .trim()
      .regex(/^[0-9]{5}$/, { error: "Indiquez un code postal à 5 chiffres." }),
  });

  const details = z.object({
    propertyType: z.enum(PROPERTY_TYPES, { error: "Indiquez le type de bien." }),
    occupancy: z.enum(OCCUPANCIES, { error: "Indiquez votre situation." }),
    timeline: z.enum(TIMELINES, { error: "Indiquez le délai souhaité." }),
  });

  const description = z.object({
    description: z.string().trim().max(4000, { error: "4 000 caractères maximum." }),
  });

  const contact = z.object({
    fullName: z
      .string()
      .trim()
      .min(2, { error: "Indiquez votre nom." })
      .max(120, { error: "120 caractères maximum." }),
    phone: z.string().transform((value, ctx) => {
      const normalized = normalizeFrenchPhone(value);
      if (!normalized) {
        ctx.addIssue({
          code: "custom",
          message: "Indiquez un numéro de téléphone français valide.",
        });
        return z.NEVER;
      }
      return normalized;
    }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, { error: "Adresse email trop longue." })
      .pipe(z.email({ error: "Indiquez une adresse email valide." })),
    callSlot: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(CALL_SLOTS).optional(),
    ),
    consent: z.boolean().refine((value) => value, {
      error: "Cochez la case pour envoyer votre demande.",
    }),
  });

  const submission = project
    .extend(details.shape)
    .extend(description.shape)
    .extend(contact.shape)
    .extend({
      /** Champ piège : invisible pour un humain, rempli par les robots. */
      website: z.string().max(200).default(""),
      turnstileToken: z.string().min(1).max(2048),
      utm: z.record(z.string().max(60), z.string().max(200)).default({}),
      landingPath: z.string().max(300).optional(),
      referrer: z.string().max(500).optional(),
    });

  return { project, details, description, contact, submission };
}

export type LeadSchemas = ReturnType<typeof createLeadSchemas>;
export type LeadSubmission = z.output<LeadSchemas["submission"]>;

/** Erreurs par champ, au format affichable (premier message de chaque champ). */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
