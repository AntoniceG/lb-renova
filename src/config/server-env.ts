import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  TURNSTILE_SECRET_KEY: z.string().min(10),
  RESEND_API_KEY: z.string().startsWith("re_"),
  RESEND_FROM_EMAIL: z.email(),
  LEADS_NOTIFICATION_EMAIL: z.email(),
  N8N_WEBHOOK_URL: z.url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(32).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Variables serveur, validées à la première utilisation (jamais au build : la CI peut
 * construire sans secrets). Une variable manquante donne une erreur explicite.
 */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables d'environnement serveur invalides ou manquantes : ${missing}`);
  }
  cached = parsed.data;
  return cached;
}
