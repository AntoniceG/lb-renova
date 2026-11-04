import { z } from "zod";

const STORAGE_KEY = "lb:attribution";
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

const attributionSchema = z.object({
  utm: z.record(z.string(), z.string()),
  landingPath: z.string(),
  referrer: z.string().nullable(),
});

export type Attribution = z.infer<typeof attributionSchema>;

/**
 * Mémorise la première page vue de la session, ses paramètres de campagne et le site
 * référent (origine seulement, sans chemin ni paramètres). Aucune donnée personnelle.
 */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of TRACKED_PARAMS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 200);
    }

    let referrer: string | null = null;
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (url.host !== window.location.host) referrer = url.origin;
    }

    const attribution: Attribution = { utm, landingPath: window.location.pathname, referrer };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // stockage indisponible ou référent illisible : le lead part sans attribution
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = attributionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
