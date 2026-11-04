import "server-only";
import { Resend } from "resend";
import { getServerEnv } from "@/config/server-env";
import { siteConfig } from "@/config/site.config";
import type { RenderedEmail } from "./templates";

let resend: Resend | undefined;

/**
 * Envoie un email via Resend. L'expéditeur est `RESEND_FROM_EMAIL` (domaine vérifié) ; les
 * réponses reviennent à la même adresse, qui redirige vers la boîte de l'équipe.
 */
export async function sendEmail(to: string, email: RenderedEmail): Promise<void> {
  const env = getServerEnv();
  resend ??= new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `${siteConfig.brand.name} <${env.RESEND_FROM_EMAIL}>`,
    to,
    replyTo: env.RESEND_FROM_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  if (error) throw new Error(`Resend : ${error.message}`);
}
