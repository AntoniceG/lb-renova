import { z } from "zod";

const siteUrl = z.url().parse(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const env = {
  /** `true` uniquement au lancement (SITE_ENV=production) : indexation + config sans TODO_. */
  isProduction: process.env.SITE_ENV === "production",
  /**
   * `true` sur le site réellement publié à son adresse (lb-renova.fr), même si `SITE_ENV` n'est pas
   * encore `production` (mise en ligne sans indexation) : Vercel pose `VERCEL_ENV=production` sur
   * le déploiement de la branche principale. Sert à ne JAMAIS montrer de contenu provisoire au
   * public (faux avis, banc d'essai), alors que les aperçus privés peuvent encore le montrer.
   */
  isPublicDeployment:
    process.env.SITE_ENV === "production" || process.env.VERCEL_ENV === "production",
  siteUrl: siteUrl.replace(/\/$/, ""),
} as const;
