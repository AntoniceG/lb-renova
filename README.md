# LB Rénova

Site vitrine de génération de leads (SEO local + trafic payant) pour une entreprise de rénovation.
Conçu comme **template réutilisable** : l'identité, les spécialités, la zone et les coordonnées vivent dans
[`src/config/site.config.ts`](src/config/site.config.ts), pas dans les composants.

- Plan et décisions : [`PLAN_PHASE1.md`](PLAN_PHASE1.md) · données à fournir : [`TODO_CLIENT.md`](TODO_CLIENT.md)
- Cahier des charges d'origine : [`docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md`](docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Zod · Vitest.
Polices : Playfair Display (titres) + DM Sans (texte) via `next/font`.
Hébergement prévu : Vercel (plan Pro). Backend (Supabase, Resend…) à partir de la phase 5.

## Structure du site (refonte définitive)

La refonte « V2 » a remplacé l'ancien site (le dernier état de l'ancien site est le tag git `v1-avant-refonte`).
Les noms de dossiers `components/v2`, `lib/v2`, `public/v2` et le préfixe `v2-` de quelques classes CSS sont
un reliquat de la refonte : ils n'ont aucune incidence sur les adresses du site.

- `src/app/` : une page par adresse (`/`, `/devis`, `/realisations`, `/articles`, `/mentions-legales`, et les trois pages métier `/renovation-complete`, `/gros-oeuvre`, `/climatisation`) ; `site.css` : styles propres au site.
- `src/lib/seo.ts` : titres, descriptions, adresses canoniques, image de partage et données structurées (schema.org) ; `app/sitemap.ts` et `app/robots.ts`.
- `design-v2/` : scripts qui fabriquent les images (photos, logos, image de partage et icônes) ; les sources lourdes n'y sont pas versionnées.
- Le banc d'essai des vagues du hero est sur `/eau` (absent du site en production).

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
3. Remplacer les logos et les photos (`design-v2/` : scripts de préparation ; résultat dans `public/v2/`), puis relancer `node design-v2/preparer-les-icones.mjs` (image de partage et icônes).
4. Réécrire les textes propres à l'entreprise : `src/lib/v2/` (histoire, expertises, zone, FAQ, avis, articles) et `src/content/services/`.
5. Vérifier les contrastes : `npm test` (la palette doit rester AA).
6. Créer le projet Supabase / Resend / Vercel du client (phases 5+), puis renseigner les variables d'environnement.

## Photos et albums

Les photos de chantier sont préparées par `design-v2/preparer-les-photos.mjs` (JPG → WebP et AVIF, en 5 largeurs,
dans `public/v2/realisations/`) et classées par métier dans `src/lib/v2/realisations.ts`. Les versions légères sont
fabriquées d'avance (le serveur ne recalcule rien) et le composant `components/v2/photo-image.tsx` laisse le
navigateur choisir la plus légère. Un album n'apparaît (et son badge n'est cliquable) qu'à partir de 2 photos.
Pour ajouter des photos : les déposer dans `design-v2/Photo de chantier/`, lancer le script (il ne fabrique que ce qui
manque ; `--force` refait tout, environ 4 minutes), puis ajouter leur description et leur métier dans `realisations.ts`.

## Devis et leads (phase 5)

- **Mini-formulaire du hero** : n'envoie rien. Le brouillon (type de projet + code postal) est dans `sessionStorage` (`lib/quote-draft.ts`) et pré-remplit `/devis`. Jamais de donnée personnelle dans l'URL.
- **`/devis`** : formulaire en 4 étapes (projet, bien, description facultative, coordonnées + consentement + Turnstile). Aucun budget, aucune photo. Les mêmes schémas Zod (`lib/leads/schema.ts`) valident chaque étape côté navigateur et la soumission côté serveur.
- **Soumission** (`app/devis/actions.ts` puis `lib/leads/submit.ts`) : validation, champ piège, Turnstile, anti-doublon (même email + même projet en 10 min), enregistrement dans Supabase **avant** tout envoi, puis (après la réponse) email de confirmation, email de notification et webhook n8n. Succès et échecs sont consignés dans `lead_events`, sans donnée personnelle.
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
