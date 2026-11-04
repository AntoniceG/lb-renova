import { z } from "zod";

const STORAGE_KEY = "lb:quote-draft";

/** Brouillon du devis partagé entre le mini-formulaire du hero et le formulaire complet. */
const quoteDraftSchema = z.object({
  projectType: z.string().min(1).max(60),
  postalCode: z.string().regex(/^\d{5}$/),
});

export type QuoteDraft = z.infer<typeof quoteDraftSchema>;

// Stocké dans la session du navigateur uniquement : jamais dans l'URL, jamais envoyé au serveur ici.
export function saveQuoteDraft(draft: QuoteDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quoteDraftSchema.parse(draft)));
  } catch {
    // stockage indisponible (navigation privée, quota) : le formulaire complet repartira vide
  }
}

/** Valeur brute du brouillon (chaîne stable, utilisable avec useSyncExternalStore). */
export function readQuoteDraftRaw(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseQuoteDraft(raw: string | null): QuoteDraft | null {
  if (!raw) return null;
  try {
    const parsed = quoteDraftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function loadQuoteDraft(): QuoteDraft | null {
  return parseQuoteDraft(readQuoteDraftRaw());
}

export function clearQuoteDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // rien à nettoyer
  }
}
