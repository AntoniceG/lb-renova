# LB Rénova — Phase 1 : audit, plan, direction artistique

> Aucun code applicatif écrit. La référence `azur-window-hub` n'a pas été modifiée (lecture seule).
> Statut : **v2 — décisions du 3 nov. 2026 intégrées (voir §8)**. En attente du feu vert pour la phase 2. Les points marqués 🔶 restent à trancher.
> Le prompt d'origine est copié dans [`docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md`](docs/PROMPT_NOUVEAU_SITE_LB_RENOVA.md) ; en cas de conflit, **ce plan v2 prévaut** (aides abandonnées, zone Aix, storytelling familial).

---

## 1. Audit de la référence `azur-window-hub`

### 1.1 Ce qu'elle est réellement
- **TanStack Start + Vite + plugin Cloudflare**, pas Next.js : aucun code n'est réutilisable tel quel, seuls les **patterns UI/UX** et les **tokens** sont repris.
- ~50 composants shadcn installés dont la grande majorité est inutilisée (sidebar, menubar, chart, input-otp, resizable…) + `recharts`, `react-query`, `react-day-picker`, `vaul`, `cmdk`. → Sur le nouveau projet : **uniquement les composants shadcn effectivement utilisés**.
- Une seule page riche (`/`) + 7 pages produit générées par un composant `ProductPage` alimenté par `src/data/products/*.ts` (type `ProductData` : bénéfices, gammes, process, images, meta).

### 1.2 À conserver (déjà dans le prompt, confirmé à la lecture)
| Élément | Fichier | Remarque |
|---|---|---|
| Composition de la landing | `routes/index.tsx` | Header → Hero → Pourquoi nous → Services → Réalisations → Avis → FAQ → CTA → Footer |
| Template page métier piloté par la donnée | `ProductPage.tsx`, `data/products/types.ts` | À réécrire en Server Component ; on garde le principe « 1 composant + 1 fichier typé par métier » |
| Tokens oklch + Tailwind v4 `@theme inline` | `styles.css` | `container-page`, `--shadow-elevated`, `--shadow-cta`, `--gradient-hero`, halos flous |
| Reveal au scroll | `Reveal.tsx`, `useInView.ts` | Remplacé par scroll-driven CSS + fallback IO (voir §5) |
| Eyebrow + H2, alternance blanc / `surface` / sombre | sections | Conservé, avec plus de rythme éditorial |
| Honeypot, CTA sticky mobile, modale | `DevisModal.tsx`, `StickyMobileCTA.tsx` | Modale → formulaire multi-étapes |

### 1.3 Défauts constatés (ceux du prompt + ceux que j'ai trouvés en plus)
Déjà listés dans le prompt et **confirmés** : formulaire stub (`setTimeout`), faux avis (`avis.ts`, « 4,9/5 – 78 avis »), hero typewriter avec `min-h` 180–260 px, placeholders grille grise + `placehold.co`, `import * as Icons`, aucune donnée structurée / sitemap / tracking.

**Défauts supplémentaires relevés** :
1. **Le faux « 4.9/5 » est aussi dans les meta `og:description`** de l'accueil (`routes/index.tsx`) — pas seulement dans la section Avis.
2. **8 fausses réalisations** codées en dur (`Realisations.tsx`) avec localités et années inventées.
3. **Stats inventées** (`PourquoiNous.tsx` : « 1500+ menuiseries », « 98 % clients satisfaits ») et FAQ affirmant « certifié RGE Qualibat » sans preuve dans le code.
4. **Accessibilité** : le dropdown « Nos produits » s'ouvre au `group-hover` uniquement (pas de `focus-within`, inaccessible au clavier) ; la barre sticky mobile est masquée par `translate-y-full` + `aria-hidden` mais **ses liens restent focusables** ; le menu mobile n'a pas de `aria-expanded`.
5. **Sticky CTA** : ne se masque ni à l'ouverture de la modale ni dans le footer (pourtant décrit dans le prompt comme comportement de la référence) → à implémenter pour de bon.
6. **Pas de SSR/SEO réel** : tout est rendu côté client dans le composant ; les `head()` sont minimaux, pas de canonical, pas d'OG image.
7. **Reveal** : `opacity-0` tant que JS n'a pas hydraté → contenu invisible si JS lent/bloqué. Le remplacement CSS (`animation-timeline: view()`) règle ça.
8. **Données de contact + URL Google de ~600 caractères en dur** dans `data/contact.ts` : confirme l'intérêt de `site.config.ts` + `settings` en base.
9. **Doublon d'icône** (`Sun` pour Pergolas et Stores), liens `to={... as never}` : typage contourné partout.

---

## 2. Direction artistique proposée

> ⚠️ **Provisoire.** Tu retravailles le logo : je ne m'en sers pas pour figer les couleurs. Le parti pris est acté : **bleu-blanc-rouge français, signe et gage de qualité**. Les tokens ci-dessous sont isolés dans un seul bloc `:root` + `site.config.ts` ; ils seront recalibrés sur le logo final (passe de ~30 min en phase 2/3).

### 2.1 Palette tricolore : bleu marine, blanc, rouge
**Blanc = surface dominante** (les pages respirent), **bleu marine = structure et confiance**, **rouge = action**. Un liseré tricolore discret (3 segments bleu / blanc / rouge, quelques px) peut servir de séparateur de marque ; pas de drapeau ni d'emblème, voir §7.2.
| Token | Rôle | Valeur oklch (approx.) |
|---|---|---|
| `--navy` | Fonds sombres (hero, CTA final, footer), texte fort | `oklch(0.27 0.07 262)` |
| `--blue` | Liens, accents secondaires, informations | `oklch(0.48 0.14 262)` |
| `--sky` | Tint de sections, fonds doux | `oklch(0.95 0.02 255)` |
| `--red` | **Réservé aux actions** (CTA, focus actif, badge « devis gratuit ») | `oklch(0.58 0.21 27)` |
| `--red-ink` | Rouge pour **texte** sur fond clair (contraste AA) | `oklch(0.50 0.19 27)` |
| `--ink` | Texte courant, teinté marine | `oklch(0.22 0.04 262)` |
| `--surface` | Alternance de sections | `oklch(0.975 0.006 255)` |

Règles :
- **Rouge = action uniquement** (un seul rouge dans chaque écran = le CTA principal). Le bleu porte l'information, le marine porte la structure. C'est une règle CRO autant que visuelle.
- Dégradés marine → bleu pour les fonds sombres ; halos flous bleu/rouge à faible opacité (reprise de la technique de la référence).
- Ombres teintées marine ; ombre de CTA teintée rouge.
- Rayons plus généreux que la référence : base `1.25rem` (carte) / `1.75rem` (blocs héros).
- Contrastes à valider par script (texte/fond, tous états) avant figement ; mode sombre hors périmètre mais tokens propres.

### 2.2 Typographies (via `next/font`) — **couple A retenu**
| | Display | Texte | Pourquoi |
|---|---|---|---|
| **A ✅ retenu** | **Bricolage Grotesque** (variable, axes graisse + largeur) | **Figtree** | Grotesque à caractère, cohérente avec le lettrage gras/italique du logo ; la variabilité de graisse permet le **mélange de graisses dans un même titre** (un mot en 800, le reste en 400). Très lisible mobile. |
| ~~B~~ | ~~Fraunces + Inter~~ | | Écarté. |

Poids de polices : subset latin, `display: swap`, 2 familles variables maximum (≈ 60–80 Ko).

### 2.3 Éléments signature
Titres fluides `clamp()` avec un mot en accent ; bento grids (1 carte « héros » par grille) ; **avant/après** comme composant central ; cartes flottantes en glassmorphism léger sur le hero uniquement ; grain très subtil sur les fonds marine.

---

## 3. Arborescence finale

```
/                         Accueil = Rénovation        SSG + ISR
/gros-oeuvre              Métier                      SSG + ISR
/climatisation            Métier                      SSG + ISR
/couverture               Métier                      SSG + ISR
/realisations             Liste filtrable             ISR (revalidateTag depuis l'admin)
/realisations/[slug]      Détail + avant/après        ISR
/zones/[city]             SEO local (Aix + 50 km)     SSG depuis table zones ; non publié → 404 + hors sitemap
/qui-sommes-nous          Histoire de famille (1945)  SSG — storytelling : grand-père tailleur de pierre → petits-enfants maçons
/contact                  
/merci                    Page de conversion          noindex
/lp/[slug]                Landing ads                 SSG, noindex, layout dédié sans header/footer
/mentions-legales  /confidentialite  /cookies
/admin/...                Back-office                 dynamique, protégé (Supabase Auth)
/sitemap.xml  /robots.txt  /llms.txt  opengraph-image
```
Route groups : `(site)` (layout complet), `(lp)` (layout nu), `admin` (layout admin). Un seul root layout.

---

## 4. Décisions d'architecture (au-delà du prompt)

1. **Template** : `site.config.ts` **validé par un schéma Zod au build** (le build échoue si une `TODO_` est présente en production — flag `SITE_ENV=production`). Dupliquer = copier le repo + remplir la config + seed SQL.
2. **Un projet Supabase par client** (pas de multi-tenant) : isolation RGPD simple, pas de RLS par tenant.
3. **Pas de `any`** ; icônes importées une à une, mappées explicitement dans un `ICONS` typé.
4. **Server Components par défaut**. Îlots client : hero slideshow, avant/après, formulaire multi-étapes, bannière cookies, sticky CTA, filtre réalisations.
5. **Flux lead** : Server Action `upsertPartialLead` (étape contact validée) → `submitLead` (statut `new`) ; emails + webhook n8n + conversions serveur lancés via `after()` pour ne pas bloquer la réponse. `event_id` généré à la soumission, réutilisé côté navigateur sur `/merci` pour dédoublonner.
6. **Rate limiting** : 🔶 option A Upstash Ratelimit (gratuit, via marketplace Vercel) ; option B règles Vercel Firewall. Je recommande A (testable, portable) — à trancher en phase 5.
7. **Images** : conversion/compression côté navigateur à l'upload admin → Supabase Storage → `next/image` avec loader dédié ; script d'optimisation local (sharp) pour les photos initiales.
8. **Avant/Après** : composant natif `<input type="range">` stylé + 2 images (accessible clavier gratuitement), pas de lib.
9. **Animations** : CSS natif (`animation-timeline: view()` avec `@supports`, fallback IntersectionObserver ≤ 1 Ko) ; `motion` uniquement pour le slideshow hero si le CSS ne suffit pas.

---

## 5. Hero — précisions de mise en œuvre

- **LCP** : la 1ʳᵉ photo est rendue dans le HTML serveur (`priority`, AVIF, dimensions fixes). Le slideshow ne démarre qu'après hydratation + idle ; les images 2…n sont préchargées à l'idle. Ken Burns **uniquement en `transform`** (GPU), jamais animé sur `width/height`.
- **H1 fixe** + mot rotatif en `aria-hidden`, variantes complètes dans une liste `sr-only` ; transition verticale fondu + `filter: blur` (appliqué par `opacity`/`transform`/`filter` seulement).
- **Pause** : survol, focus, `visibilitychange`, `prefers-reduced-motion` (image 1 figée, mot statique).
- **Mini-formulaire** (type de projet + téléphone/CP) : pré-remplit l'étape 2 ; **ne crée pas de lead tant que l'utilisateur n'a pas cliqué sur le bouton** (voir §7, point RGPD).

---

## 6. Plan par phase

| # | Phase | Livrables principaux | Décisions / entrées à fournir avant |
|---|---|---|---|
| 1 | **Audit + plan** *(ce document)* | `PLAN_PHASE1.md`, `TODO_CLIENT.md` | ✅ DA, typo, zone, dossier : actés (§8). Reste : feu vert phase 2 |
| 2 | **Fondations** | Projet Next.js (+TS strict, ESLint, Prettier), `site.config.ts` + schéma Zod, tokens, polices, layout (header accessible, footer, sticky CTA), shadcn minimal, CI GitHub Actions (lint, tsc, build), déploiement preview Vercel | Dossier/repo, compte Vercel Pro, couple typo, logo final (ou provisoire) |
| 3 | **Landing Rénovation** | Hero cinématique, bandeau réassurance, bento des 3 spécialités, avant/après, process, réalisations (données de seed *marquées démo*, jamais en prod), bloc « histoire de famille » (teaser vers `/qui-sommes-nous`), garanties, zone Aix + 50 km, FAQ, bloc avis « démarrage », CTA final ; metadata de base | Photos de chantiers triées + paires avant/après, attestation décennale |
| 4 | **Pages métiers + Qui sommes-nous** | 3 pages ≥ 800 mots utiles chacune, `/qui-sommes-nous` (storytelling familial, texte complet à fournir par toi) | Périmètre réel des prestations, récit familial complet |
| 5 | **Backend leads** | Migrations + RLS + seed, formulaire 4 étapes, partial lead, Turnstile + honeypot + rate-limit, Resend (2 emails), `/merci`, webhook HMAC, tests Playwright du parcours | Projets Supabase/Resend/Turnstile créés, domaine d'envoi, URL n8n, délai de rappel promis |
| 6 | **Réalisations + admin** | CRUD, upload + compression, avant/après, ISR, leads (liste, fiche, statuts, notes, CSV), avis manuels, zones, settings, « demander un avis Google » | Comptes admin, QR/lien avis Google |
| 7 | **SEO avancé** | JSON-LD (GeneralContractor, Service, Breadcrumb, FAQ), sitemap/robots/llms.txt, `/zones/[city]` (contenu unique par zone), OG images, maillage, audit Lighthouse | Contenu local réel par zone, NAP identique à la fiche Google |
| 8 | **Tracking & ads** | GTM, Consent Mode v2 + bannière, événements, conversions serveur (Meta CAPI, Google Ads), persistance UTM/gclid/fbclid, `/lp/[slug]`, dashboard leads | IDs GTM/GA4/Ads/Pixel, token CAPI, accès Google Ads |
| 9 | **Recette & lancement** | e2e, axe, perf, RGPD, redirections www, checklist Search Console/Bing, guide admin client | Domaine + DNS, mentions légales complètes |

Chaque phase se termine par : lint + `tsc --noEmit` + build verts, tests de la phase, résumé, liste du reste, **commit**, et j'attends ton feu vert.

---

## 7. Points d'attention juridiques / techniques

1. **Storytelling « depuis 1945 » : bien distinguer l'histoire de famille de l'entreprise.** Le récit (grand-père immigré italien, tailleur de pierre, petits-enfants maçons dans l'entreprise) est un atout fort et il est retenu. Pour rester inattaquable : on parle de **savoir-faire / histoire de famille depuis 1945**, jamais d'« entreprise fondée en 1945 » ni de « 80 ans d'expérience de l'entreprise ». La date réelle d'immatriculation figure dans les mentions légales. Les faits (prénom, année et lieu d'arrivée, ce que « 1945 » désigne exactement, rôle de la génération intermédiaire — le logo dit « de père en fils ») viennent de toi ; **je n'invente aucun détail du récit**. La mention « depuis plus de 20 ans » du logo reste **inutilisée** tant que son sens n'est pas précisé.
2. **Bleu-blanc-rouge** : retenu comme signe de qualité (marketing). Il reste un choix **graphique**. Par prudence, pas de mention « Made in France » / « Origine France » / « artisan français certifié » sans base vérifiable (l'usage d'emblèmes tricolores qui laissent entendre une origine est surveillé pour les produits ; pour des travaux le risque est faible, mais on s'en tient au graphisme).
3. **RGE** : simple **effet de réassurance**, affiché comme badge/logo, sans n° de certificat ni domaines détaillés, et **sans aucune mention d'aide financière** (MaPrimeRénov' et toute aide retirées du périmètre : plus de page « aides », de mini-quiz ni de champ `eligibility_hint`). Garde-fou unique : le badge est piloté par `certifications.rge.enabled` dans la config et ne doit être activé que si l'entreprise détient réellement la qualification (afficher « RGE » sans l'avoir est une pratique commerciale trompeuse). Je le laisse **désactivé par défaut** jusqu'à ton feu vert explicite.
4. **RGPD et capture partielle** : le lead `partial` n'est créé **qu'à la validation explicite de l'étape « coordonnées »** (bouton « Continuer »), avec mention d'information visible (finalité, durée de conservation, droit d'opposition), jamais à la frappe. Les relances sur lead partiel supposent une base légale claire (consentement recommandé en B2C). 🔶 à confirmer en phase 5.
5. **Conversions serveur (Meta CAPI / Google Ads)** : envoyées **uniquement si le consentement marketing a été donné** (stocké avec le lead).
6. **Cibles Lighthouse** : « 100 » en SEO / a11y / bonnes pratiques est réaliste ; **perf ≥ 90 mobile avec GTM + Pixel + Turnstile** ne l'est que si les tags sont chargés *après consentement/idle*. Je mesure sur la page de prod, pas en local.
7. **Pages `/zones`** : risque « pages satellites ». Lancement avec **3–5 communes réellement documentées**, les autres restent `published=false`.
8. **Supabase gratuit** met un projet en pause après ~1 semaine d'inactivité : inadapté à un site de leads → plan payant dès la prod (à vérifier à la souscription). Vercel Pro déjà acté.
9. **Next.js** : le prompt impose la 15 ; à ma connaissance la 16 est sortie en stable. **Retenu par défaut** : je vérifie la doc officielle au démarrage de la phase 2 et pars sur la dernière stable, sauf objection de ta part.

---

## 8. Décisions actées (réponses du 3 nov. 2026)

| Sujet | Décision |
|---|---|
| Emplacement | **Tout reste dans `LB Rénova`** (code, docs, prompt copié dans `docs/`). Aucun autre dossier de projet. |
| Identité visuelle | **Bleu-blanc-rouge français** = signe de qualité. Palette §2 conservée et recalibrée sur le logo final. |
| Typographie | **Couple A** : Bricolage Grotesque + Figtree. |
| Zone | **Aix-en-Provence, rayon 50 km.** |
| Récit | « Depuis 1945 » conservé, porté par un **storytelling familial** (page `/qui-sommes-nous` + bloc sur l'accueil). Texte complet à venir de ta part ; formulation « histoire de famille depuis 1945 » validée. |
| RGE | Badge de réassurance seul (logo), sans détails de certificat ; activable via config (voir §7.3). |
| « Phocéen » | **Abandonné** : aucune mention dans les textes ni les metadonnées. |
| Zone | Aix-en-Provence + 50 km : validée (communes prioritaires pour `/zones` à confirmer). |
| Statut de l'entreprise | Aucune mention « récemment créée » : seuls le nom et le statut sont nouveaux. |
| Aides | **MaPrimeRénov' et toute aide : abandonnées** (page, quiz, teaser, FAQ). |
| Inspiration | Uniquement `azur-window-hub`. |
| Délai de rappel | **« sous 48 h »** (affiché en puce de réassurance, FAQ, `/merci` et email de confirmation). |
| Leads partiels | **Option A** : rien d'enregistré avant la validation explicite de l'étape contact (mention d'information visible) ; statut « incomplet » dans l'admin ; aucune relance automatique ; suppression à 30 jours si non finalisé. |
| Limitation de débit | **Pare-feu Vercel** (Pro) + honeypot + Turnstile ; pas d'Upstash sauf spam avéré (remplace la préférence initiale du §6.6). |
| Démarrage phase 5 | On attend que Supabase, Resend, Turnstile et n8n soient prêts avant de la lancer. |

### Reste à confirmer
1. 🔶 **Dépôt git** : le dossier est à l'intérieur du dépôt parent `CODING`. Par défaut je fais un `git init` **ici** (dépôt séparé, comme demandé dans le prompt) ; le parent verra alors un dépôt imbriqué.
2. **Communes prioritaires** pour les pages `/zones` (proposition à valider, toutes dans les ~50 km d'Aix : Aix-en-Provence, Marseille, Gardanne, Salon-de-Provence, Pertuis).
3. **Adresse du siège** (la fiche Google et le NAP doivent rester identiques au site).
4. ~~Qualifications RGE~~ : plus nécessaires (badge seul).
5. **Faits du récit** familial (voir §7.1) et photos associées.
