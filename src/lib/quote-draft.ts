import { z } from "zod";

const STORAGE_KEY = "lb:quote-draft";

/** Brouillon du devis partagé entre le mini-formulaire du hero et le formulaire complet (phase 5). */
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

export function loadQuoteDraft(): QuoteDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = quoteDraftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
