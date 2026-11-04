# LB Rénova

Site vitrine de génération de leads (SEO local + trafic payant) pour une entreprise de rénovation.
Conçu comme **template réutilisable** : l'identité, les spécialités, la zone et les coordonnées vivent dans
[`src/config/site.config.ts`](src/config/site.config.ts), pas dans les composants.

- Plan et décisions : [`PLAN_PHASE1.md`](PLAN_PHASE1.md) · données à fournir : [`TODO_CLIENT.md`](TODO_CLIENT.md)
- Cahier des charges d'origine : [`docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md`](docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Zod · Vitest.
Polices : Bricolage Grotesque (titres) + Figtree (texte) via `next/font`.
Hébergement prévu : Vercel (plan Pro). Backend (Supabase, Resend…) à partir de la phase 5.

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

| Commande               | Rôle                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Serveur de développement                              |
| `npm run build`        | Build de production                                   |
| `npm run lint`         | ESLint (aucun `any`, imports de types)                |
| `npm run typecheck`    | `tsc --noEmit`                                        |
| `npm test`             | Vitest : schéma de config, contrastes WCAG de la DA   |
| `npm run format:check` | Prettier                                              |
| `npm run check`        | lint + typecheck + tests + build                      |

La CI GitHub Actions (`.github/workflows/ci.yml`) exécute lint, format, typecheck, tests et build.

## Variables d'environnement

Voir [`.env.example`](.env.example).

| Variable               | Rôle                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (metadataBase, canonical, sitemap)                                                       |
| `SITE_ENV`             | `production` au lancement uniquement : autorise l'indexation **et fait échouer le build s'il reste un `TODO_`** |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (aucun accès aux tables : tout est fermé par la RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur uniquement, jamais exposée au navigateur |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé publique Cloudflare Turnstile (anti-robot) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile, vérifiée côté serveur |
| `RESEND_API_KEY` | Clé d'envoi Resend (`re_…`) |
| `RESEND_FROM_EMAIL` | Expéditeur et adresse de réponse, sur le domaine vérifié |
| `LEADS_NOTIFICATION_EMAIL` | Destinataire de la notification de chaque nouveau lead |
| `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` | Webhook n8n signé en HMAC (facultatifs : sans eux, l'envoi à n8n est ignoré) |

Tant que `SITE_ENV` n'est pas `production`, le site envoie `noindex` et `robots.txt` interdit tout (previews, dev).

## Données manquantes (`TODO_`)

Toute information client absente est une constante `todo("…")` dans `site.config.ts`, affichée telle quelle à
l'écran (ex. `TODO_PHONE`) et listée dans `TODO_CLIENT.md`. Le build avec `SITE_ENV=production` échoue en listant
les chemins restants.

## Créer un nouveau site à partir du template

1. Dupliquer le dépôt.
2. Remplir `src/config/site.config.ts` : marque, palette (oklch), coordonnées, zone, spécialités, certifications.
3. Si une spécialité utilise une nouvelle icône : l'ajouter à `ICON_KEYS` (`site.schema.ts`) et à `ICONS` (`components/ui/icons.ts`).
4. Remplacer le logotype provisoire (`components/brand/logo.tsx`) par le logo SVG du client.
5. Vérifier les contrastes : `npm test` (la palette doit rester AA).
6. Créer le projet Supabase / Resend / Vercel du client (phases 5+), puis renseigner les variables d'environnement.

## Contenu de démonstration et photos

Aucune photo réelle n'est encore fournie. Les gabarits visuels fonctionnent sans :

- **Hero** : `heroSlides` dans `src/content/home.ts`. Sans `image`, fond dégradé ; avec images (AVIF/WebP dans `public/images/hero/`), diaporama en fondu + zoom, étiquette « Métier – Ville », première image en `priority`.
- **Avant/Après et réalisations récentes** : alimentés par `src/content/demo.ts`, affichés avec un badge « Démo » et **masqués quand `SITE_ENV=production`** (`showDemo`). Ils passent en données réelles en phase 6 (admin + base).
- Quand les photos arrivent : renseigner `heroSlides`, puis retirer les marqueurs démo.

## Devis et leads (phase 5)

- **Mini-formulaire du hero** : n'envoie rien. Le brouillon (type de projet + code postal) est dans `sessionStorage` (`lib/quote-draft.ts`) et pré-remplit `/devis`. Jamais de donnée personnelle dans l'URL.
- **`/devis`** : formulaire en 4 étapes (projet, bien, description facultative, coordonnées + consentement + Turnstile). Aucun budget, aucune photo. Les mêmes schémas Zod (`lib/leads/schema.ts`) valident chaque étape côté navigateur et la soumission côté serveur.
- **Soumission** (`app/(site)/devis/actions.ts` puis `lib/leads/submit.ts`) : validation, champ piège, Turnstile, anti-doublon (même email + même projet en 10 min), enregistrement dans Supabase **avant** tout envoi, puis (après la réponse) email de confirmation, email de notification et webhook n8n. Succès et échecs sont consignés dans `lead_events`, sans donnée personnelle.
- **`/merci`** : page de remerciement, `noindex`, destinée à la mesure de conversion (phase 8).
- **Base** : `supabase/migrations/` (tables `leads`, `lead_events`, `admin_profiles`, RLS fermée au public ; seul le serveur écrit avec la clé service_role). `supabase/optional/` : purge quotidienne à planifier (pg_cron) après validation des durées de conservation.
- **n8n** : `n8n/lead-intake.workflow.json` et contrat dans `docs/N8N_WEBHOOK.md`.
- **Tests locaux sans vrai Turnstile** : lancer `npm run dev` avec `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA` et `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (clés de test Cloudflare qui valident toujours).

## Pages internes

- `/design-system` : palette, typographie, boutons (404 en production).
- `/devis`, `/merci` : parcours de devis (voir ci-dessus).

## Sécurité

En-têtes de sécurité posés dans `next.config.ts` (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy).
La Content-Security-Policy arrive en phase 8, avec les tags de suivi dont elle dépend.
