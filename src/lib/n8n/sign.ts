import { createHmac } from "node:crypto";

/**
 * Signature attendue par le workflow n8n (voir docs/N8N_WEBHOOK.md) :
 * `sha256=` + HMAC-SHA256 hexadécimal de "<timestamp>.<corps brut>".
 */
export function signWebhookBody(secret: string, timestamp: string, rawBody: string): string {
  const digest = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return `sha256=${digest}`;
}
