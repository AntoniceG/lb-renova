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

## Mini-formulaire du hero

Il n'envoie rien au serveur : le brouillon (type de projet + code postal) est stocké dans `sessionStorage` (`lib/quote-draft.ts`) pour pré-remplir le formulaire de devis complet (phase 5). Jamais de donnée personnelle dans l'URL.

## Pages internes

- `/design-system` : palette, typographie, boutons (404 en production).

## Sécurité

En-têtes de sécurité posés dans `next.config.ts` (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy).
La Content-Security-Policy arrive en phase 8, avec les tags de suivi dont elle dépend.
