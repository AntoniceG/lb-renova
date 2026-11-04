"use server";

import { headers } from "next/headers";
import { getProjectTypeOptions } from "@/lib/leads/options";
import { createLeadSchemas } from "@/lib/leads/schema";
import { createSubmitDeps } from "@/lib/leads/service";
import { submitLead, type SubmitResult } from "@/lib/leads/submit";

/** Action serveur du formulaire de devis. Ne renvoie jamais de détail technique au navigateur. */
export async function submitQuote(raw: unknown): Promise<SubmitResult> {
  try {
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      requestHeaders.get("x-real-ip") ??
      undefined;
    const schemas = createLeadSchemas(getProjectTypeOptions().map((option) => option.value));
    return await submitLead(raw, { ip, schemas }, createSubmitDeps());
  } catch (error) {
    console.error(
      "[leads] soumission en échec :",
      error instanceof Error ? error.message : "erreur inconnue",
    );
    return { ok: false, error: "server" };
  }
}
