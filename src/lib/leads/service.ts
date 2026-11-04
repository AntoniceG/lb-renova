import "server-only";
import { after } from "next/server";
import { getServerEnv } from "@/config/server-env";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
  type EmailBrand,
  type LeadEmailData,
} from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { sendLeadToN8n } from "@/lib/n8n/send";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { formatLeadRef, getProjectTypeLabel } from "./options";
import { formatFrenchPhone } from "./phone";
import {
  CALL_SLOT_LABELS,
  OCCUPANCY_LABELS,
  PROPERTY_TYPE_LABELS,
  TIMELINE_LABELS,
  type LeadSubmission,
} from "./schema";
import type { InsertedLead, SubmitDeps } from "./submit";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

function buildEmailBrand(): EmailBrand {
  const { brand, promise, contact } = siteConfig;
  const hasPhone = !isTodo(contact.phone.display) && !isTodo(contact.phone.e164);
  return {
    name: brand.name,
    callbackDelay: isTodo(promise.callbackDelay) ? null : promise.callbackDelay,
    phone: hasPhone ? { display: contact.phone.display, e164: contact.phone.e164 } : null,
  };
}

function buildEmailData(ref: string, submission: LeadSubmission): LeadEmailData {
  return {
    ref,
    fullName: submission.fullName,
    phone: submission.phone,
    phoneDisplay: formatFrenchPhone(submission.phone),
    email: submission.email,
    projectLabel: getProjectTypeLabel(submission.projectType),
    postalCode: submission.postalCode,
    propertyType: PROPERTY_TYPE_LABELS[submission.propertyType],
    occupancy: OCCUPANCY_LABELS[submission.occupancy],
    timeline: TIMELINE_LABELS[submission.timeline],
    callSlot: submission.callSlot ? CALL_SLOT_LABELS[submission.callSlot] : undefined,
    description: submission.description === "" ? undefined : submission.description,
    utm: submission.utm,
    landingPath: submission.landingPath,
    referrer: submission.referrer,
  };
}

interface DeliveryTask {
  kind: "confirmation" | "notification" | "n8n";
  column: "confirmation_email_sent_at" | "notification_email_sent_at" | "webhook_sent_at";
  okType: "email_sent" | "webhook_sent";
  failType: "email_failed" | "webhook_failed";
  /** Retourne `false` si l'envoi est volontairement ignoré (n8n non configuré). */
  run: () => Promise<boolean>;
}

/**
 * Emails (confirmation au prospect, notification à l'équipe) et webhook n8n. Chaque envoi est
 * indépendant ; succès et échecs sont consignés dans lead_events (sans donnée personnelle).
 */
export async function deliverLead(lead: InsertedLead, submission: LeadSubmission): Promise<void> {
  const env = getServerEnv();
  const supabase = getSupabaseAdmin();
  const ref = formatLeadRef(lead.refNumber, lead.createdAt);
  const brand = buildEmailBrand();
  const data = buildEmailData(ref, submission);

  const tasks: DeliveryTask[] = [
    {
      kind: "confirmation",
      column: "confirmation_email_sent_at",
      okType: "email_sent",
      failType: "email_failed",
      run: async () => {
        await sendEmail(submission.email, renderConfirmationEmail(brand, data));
        return true;
      },
    },
    {
      kind: "notification",
      column: "notification_email_sent_at",
      okType: "email_sent",
      failType: "email_failed",
      run: async () => {
        await sendEmail(env.LEADS_NOTIFICATION_EMAIL, renderNotificationEmail(brand, data));
        return true;
      },
    },
    {
      kind: "n8n",
      column: "webhook_sent_at",
      okType: "webhook_sent",
      failType: "webhook_failed",
      run: () =>
        sendLeadToN8n({
          event: "lead.created",
          sentAt: new Date().toISOString(),
          lead: {
            id: lead.id,
            ref,
            createdAt: lead.createdAt,
            project: { type: submission.projectType, label: data.projectLabel },
            postalCode: submission.postalCode,
            propertyType: submission.propertyType,
            occupancy: submission.occupancy,
            timeline: submission.timeline,
            description: submission.description === "" ? null : submission.description,
            contact: {
              fullName: submission.fullName,
              phone: submission.phone,
              email: submission.email,
              callSlot: submission.callSlot ?? null,
            },
            utm: submission.utm,
            landingPath: submission.landingPath ?? null,
            referrer: submission.referrer ?? null,
          },
        }),
    },
  ];

  await Promise.allSettled(
    tasks.map(async (task) => {
      try {
        const done = await task.run();
        if (!done) return;
        await supabase
          .from("leads")
          .update({ [task.column]: new Date().toISOString() })
          .eq("id", lead.id);
        await supabase
          .from("lead_events")
          .insert({ lead_id: lead.id, type: task.okType, data: { kind: task.kind } });
      } catch (error) {
        const message = error instanceof Error ? error.message.slice(0, 200) : "erreur inconnue";
        console.error(`[leads] envoi ${task.kind} en échec pour ${ref} : ${message}`);
        await supabase
          .from("lead_events")
          .insert({ lead_id: lead.id, type: task.failType, data: { kind: task.kind, message } });
      }
    }),
  );
}

/** Dépendances réelles de `submitLead` : Turnstile, Supabase (service_role), Resend, n8n. */
export function createSubmitDeps(): SubmitDeps {
  const env = getServerEnv();
  const supabase = getSupabaseAdmin();

  return {
    verifyCaptcha: (token, ip) => verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip),

    hasRecentDuplicate: async (email, projectType) => {
      const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
      const { data, error } = await supabase
        .from("leads")
        .select("id")
        .eq("email", email)
        .eq("project_type", projectType)
        .gte("created_at", since)
        .limit(1);
      if (error) throw new Error(`Supabase : ${error.message}`);
      return (data?.length ?? 0) > 0;
    },

    insertLead: async (row) => {
      const { data, error } = await supabase
        .from("leads")
        .insert(row)
        .select("id, ref_number, created_at")
        .single<{ id: string; ref_number: number; created_at: string }>();
      if (error) throw new Error(`Supabase : ${error.message}`);
      await supabase.from("lead_events").insert({ lead_id: data.id, type: "created", data: {} });
      return { id: data.id, refNumber: data.ref_number, createdAt: data.created_at };
    },

    afterResponse: (task) => after(task),
    deliver: deliverLead,
  };
}
