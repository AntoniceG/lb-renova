import { CONSENT_VERSION, toFieldErrors, type LeadSchemas, type LeadSubmission } from "./schema";

export interface NewLeadRow {
  status: "new";
  project_type: string;
  postal_code: string;
  property_type: string;
  occupancy: string;
  timeline: string;
  description: string | null;
  full_name: string;
  phone: string;
  email: string;
  call_slot: string | null;
  consent_at: string;
  consent_version: string;
  utm: Record<string, string>;
  landing_path: string | null;
  referrer: string | null;
  completed_at: string;
}

export interface InsertedLead {
  id: string;
  refNumber: number;
  createdAt: string;
}

export interface SubmitDeps {
  verifyCaptcha: (token: string, ip?: string) => Promise<boolean>;
  hasRecentDuplicate: (email: string, projectType: string) => Promise<boolean>;
  insertLead: (row: NewLeadRow) => Promise<InsertedLead>;
  /** Exécute une tâche après l'envoi de la réponse au visiteur (emails, webhook). */
  afterResponse: (task: () => Promise<void>) => void;
  deliver: (lead: InsertedLead, submission: LeadSubmission) => Promise<void>;
  now?: () => Date;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: "invalid"; fieldErrors: Record<string, string> }
  | { ok: false; error: "captcha" | "server" };

interface SubmitContext {
  ip?: string;
  schemas: LeadSchemas;
}

function toRow(submission: LeadSubmission, now: Date): NewLeadRow {
  const iso = now.toISOString();
  return {
    status: "new",
    project_type: submission.projectType,
    postal_code: submission.postalCode,
    property_type: submission.propertyType,
    occupancy: submission.occupancy,
    timeline: submission.timeline,
    description: submission.description === "" ? null : submission.description,
    full_name: submission.fullName,
    phone: submission.phone,
    email: submission.email,
    call_slot: submission.callSlot ?? null,
    consent_at: iso,
    consent_version: CONSENT_VERSION,
    utm: submission.utm,
    landing_path: submission.landingPath ?? null,
    referrer: submission.referrer ?? null,
    completed_at: iso,
  };
}

/**
 * Traite l'envoi du devis : validation, anti-robot (champ piège + Turnstile), anti-doublon,
 * enregistrement, puis emails et webhook après la réponse. Le lead est enregistré avant tout
 * envoi : un échec d'email ou de n8n n'en fait jamais perdre un.
 */
export async function submitLead(
  raw: unknown,
  context: SubmitContext,
  deps: SubmitDeps,
): Promise<SubmitResult> {
  const parsed = context.schemas.submission.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "invalid", fieldErrors: toFieldErrors(parsed.error) };
  }
  const submission = parsed.data;

  // Champ piège rempli : on répond comme un succès pour ne rien apprendre au robot.
  if (submission.website !== "") return { ok: true };

  if (!(await deps.verifyCaptcha(submission.turnstileToken, context.ip))) {
    return { ok: false, error: "captcha" };
  }

  // Double envoi (double clic, rechargement) : même email et même projet en 10 minutes.
  if (await deps.hasRecentDuplicate(submission.email, submission.projectType)) {
    return { ok: true };
  }

  const inserted = await deps.insertLead(toRow(submission, (deps.now ?? (() => new Date()))()));
  deps.afterResponse(() => deps.deliver(inserted, submission));
  return { ok: true };
}
