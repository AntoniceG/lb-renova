import "server-only";
import { getServerEnv } from "@/config/server-env";
import { signWebhookBody } from "./sign";

export interface LeadWebhookPayload {
  event: "lead.created";
  sentAt: string;
  lead: Record<string, unknown>;
}

/**
 * Envoie un lead au workflow n8n, signé en HMAC (docs/N8N_WEBHOOK.md).
 * Retourne `false` si le webhook n'est pas configuré ; lève une erreur si n8n refuse ou
 * ne répond pas (l'appelant la consigne, le lead est déjà enregistré).
 */
export async function sendLeadToN8n(payload: LeadWebhookPayload): Promise<boolean> {
  const { N8N_WEBHOOK_URL: url, N8N_WEBHOOK_SECRET: secret } = getServerEnv();
  if (!url || !secret) return false;

  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-LB-Timestamp": timestamp,
      "X-LB-Signature": signWebhookBody(secret, timestamp, body),
    },
    body,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`n8n a répondu ${response.status}`);
  return true;
}
