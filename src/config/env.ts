import { z } from "zod";

const siteUrl = z.url().parse(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const env = {
  /** `true` uniquement au lancement (SITE_ENV=production) : indexation + config sans TODO_. */
  isProduction: process.env.SITE_ENV === "production",
  siteUrl: siteUrl.replace(/\/$/, ""),
} as const;
