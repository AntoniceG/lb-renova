import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/config/server-env";

let client: SupabaseClient | undefined;

/**
 * Client Supabase avec la clé service_role : contourne la RLS, serveur uniquement.
 * Les tables leads ne sont accessibles qu'à travers lui (les clés publiques n'ont aucun accès).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const env = getServerEnv();
  client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
