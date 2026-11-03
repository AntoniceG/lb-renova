# PROMPT — Nouveau site LB Rénova (template réutilisable)

> À coller tel quel dans Claude Code, lancé dans un dossier VIDE (ex. `C:\Users\g.abramin\Desktop\CODING\lb-renova`).
> Le site de référence `C:\Users\g.abramin\Desktop\CODING\azur-window-hub` est à lire en LECTURE SEULE.
> Les champs `[À COMPLÉTER]` sont à remplir avant de lancer (ou à laisser : Claude les mettra en constantes `TODO_` dans la config).

---

## 0. RÔLE ET MÉTHODE

Tu es un lead développeur front/back et un expert SEO local + CRO (conversion). Tu construis un site vitrine de génération de leads pour une entreprise de rénovation, conçu pour :
1. **Se positionner durablement en SEO naturel** (SEO local + pages métiers).
2. **Convertir le trafic payant** (Google Ads / Meta Ads) via des landing pages dédiées et un tracking de conversion fiable.
3. **Être un template réutilisable** : toute l'identité, les métiers, les zones et les coordonnées vivent dans une config + la base de données. Dupliquer le projet pour une autre entreprise de service local doit demander de modifier la config, pas le code.

Emplacement du projet (règle absolue) :
- Le nouveau site est un **projet entièrement distinct**, à créer dans un nouveau dossier : `C:\Users\g.abramin\Desktop\CODING\lb-renova` (crée-le s'il n'existe pas, `git init` dedans, dépôt Git séparé).
- **Ne crée, ne modifie et ne supprime AUCUN fichier dans `C:\Users\g.abramin\Desktop\CODING\azur-window-hub`** : ce dossier est une référence en lecture seule.
- Aucun nom, contenu ou donnée d'Azur Window ne doit se retrouver dans le nouveau projet (textes, coordonnées, avis, images).

Méthode de travail obligatoire :
- **Commence par lire** le site de référence (voir §2) et produis un **plan en phases** (§14). Attends ma validation du plan avant d'écrire du code.
- Travaille **phase par phase**. À la fin de chaque phase : `lint` + `typecheck` + `build` verts, résumé de ce qui est fait, liste de ce qui reste, commit. Ne passe pas à la phase suivante sans mon feu vert.
- **N'invente JAMAIS** de fait business : pas de faux avis, pas de fausse note Google, pas de faux chiffres (« 20 ans d'expérience », « 1500 chantiers », « 4,9/5 »…), pas de faux numéros RGE/assurance. Si une donnée manque, utilise une constante `TODO_…` visible dans `src/config/site.ts` et liste-la dans un fichier `TODO_CLIENT.md`.
- Pose-moi une question plutôt que de deviner quand une décision change la structure du projet.
- Code en TypeScript strict, sans `any`, commentaires rares et utiles, noms en anglais dans le code, contenus en français.

---

## 1. CONTEXTE BUSINESS

- **Entreprise** : LB Rénova — entreprise de rénovation **récemment créée** (pas encore d'avis Google réels, seule la fiche Google Business existe).
- **Positionnement** : entreprise générale de rénovation ; chaque corps de métier est porté par un spécialiste de l'entreprise.
- **Certifications / garanties** : **RGE** et **assurance décennale** (n° de certificat RGE : `[À COMPLÉTER]`, assureur + n° de police décennale : `[À COMPLÉTER]`).
- **Cible** : propriétaires de maisons/appartements, projets de rénovation à 5 k€–150 k€, souvent éligibles à des aides (MaPrimeRénov', CEE, éco-PTZ) grâce au RGE.
- **Zone d'intervention** : `[À COMPLÉTER : ville de base + rayon + liste des communes prioritaires]`.
- **Coordonnées** : téléphone `[À COMPLÉTER]`, email `[À COMPLÉTER]`, adresse/siège `[À COMPLÉTER]`, SIRET `[À COMPLÉTER]`, horaires `[À COMPLÉTER]`, WhatsApp `[À COMPLÉTER]`, URL de la fiche Google Business `[À COMPLÉTER]`, domaine `[À COMPLÉTER]`.
- **Identité visuelle** : seul le **logo** existe (fichier fourni : `[À COMPLÉTER : chemin]`). Tu dois **extraire la palette depuis le logo** et proposer une direction artistique (palette, typographies) que je valide avant la phase design.
- **Photos** : de vraies photos de chantiers existent (dossier : `[À COMPLÉTER]`). Elles alimentent le hero, les réalisations et les pages métiers. Prévois leur optimisation (AVIF/WebP, tailles responsives) et leur gestion via l'admin.

### Architecture du site (4 « univers »)
| Page | Rôle | Slug |
|---|---|---|
| **Accueil = Rénovation** | Page générale : met en avant la rénovation globale et oriente vers les spécialités | `/` |
| **Gros œuvre** | Dalles, ouverture de murs porteurs, maçonnerie, extensions, etc. | `/gros-oeuvre` |
| **Climatisation** | Installation / remplacement clim réversible, pompe à chaleur air-air (RGE) | `/climatisation` |
| **Couverture** | Toiture, réfection, isolation de toiture, zinguerie | `/couverture` |

Pages complémentaires : `/realisations` (+ détail `/realisations/[slug]`), `/a-propos`, `/contact`, `/aides-renovation` (explicatif MaPrimeRénov'/CEE, levier de conversion et de SEO), `/zones/[ville]` (SEO local), `/merci` (page de conversion), pages légales (mentions, confidentialité, cookies), 404 soignée, et des landing pages ads `/lp/[slug]`.

---

## 2. SITE DE RÉFÉRENCE : CE QU'ON GARDE, CE QU'ON CORRIGE

Lis `C:\Users\g.abramin\Desktop\CODING\azur-window-hub` (surtout `src/components/sections/*`, `src/components/ProductPage.tsx`, `src/components/DevisModal.tsx`, `src/components/Header.tsx`, `src/components/StickyMobileCTA.tsx`, `src/components/Reveal.tsx`, `src/hooks/useInView.ts`, `src/data/products/*`, `src/styles.css`, et les fichiers `*.md` à la racine).

### À conserver (UI/UX)
- **Composition de la landing** : Header sticky (logo, nav, CTA devis, dropdown « Nos produits » desktop / accordéon mobile) → Hero → Pourquoi nous (stats + 4 piliers) → Services (cartes cliquables vers pages dédiées) → Réalisations (galerie filtrable) → Avis → FAQ (accordion) → CTA final sur fond sombre → Footer (contact, zones, services).
- **Template de page métier piloté par la donnée** : un composant générique + un fichier de données typé par métier (bénéfices, gammes, process en 4 étapes, galerie, FAQ, meta SEO). Mini-hero avec fil d'Ariane, 2 CTA (devis / appel).
- **Éléments de conversion** : CTA sticky mobile (apparaît après ~400 px de scroll, masqué quand la modale est ouverte ou dans le footer), modale de devis, honeypot anti-bot, réassurance sous le hero.
- **Design tokens** : variables CSS en `oklch`, Tailwind v4 (`@theme inline`), `container-page`, rayons généreux, ombres douces teintées de la couleur de marque, dégradés sombres + halos flous de la couleur primaire.
- **Animations d'apparition au scroll** (`Reveal` + `IntersectionObserver`, stagger, désactivées si `prefers-reduced-motion`).
- Eyebrow en petites capitales colorées au-dessus de chaque H2 ; alternance de sections blanc / `surface` / sombre.

### À corriger (défauts constatés dans la référence)
- **Aucun vrai backend** : le formulaire de devis est un stub (`setTimeout`), rien n'est stocké ni envoyé.
- **Faux avis et fausses stats codés en dur** (`src/data/avis.ts`, « 4,9/5 – 78 avis »). Interdit sur le nouveau site : légalement risqué (pratiques commerciales trompeuses) et mauvais pour la confiance.
- **Hero « machine à écrire »** (`useTypewriter`) avec `min-h` énorme pour éviter le CLS : à remplacer (voir §6).
- **Visuels placeholders** (grille grise) et images de secours externes (`placehold.co`) : à proscrire.
- `import * as Icons from "lucide-react"` dans `ProductPage` : embarque toute la librairie d'icônes. Importer uniquement les icônes utilisées (ou mapper explicitement).
- **Aucune donnée structurée**, pas de sitemap/robots, pas de tracking, pas de pages SEO locales, pas de page de confirmation.
- Style de titre trop uniforme d'une section à l'autre : introduire plus de rythme éditorial (voir §5).

---

## 3. STACK IMPOSÉE (et pourquoi)

Objectif : SEO solide à long terme + trafic payant + back-office. Choix :

- **Next.js 15 (App Router) + React 19 + TypeScript strict**
  Pourquoi : rendu serveur/statique (HTML complet pour Google), API `metadata`/`sitemap`/`robots` natives, `next/image` (AVIF/WebP, responsive, anti-CLS), ISR pour que les réalisations ajoutées via l'admin apparaissent sans redéploiement, Server Actions pour le formulaire, et le site + l'admin vivent dans le même projet.
- **Tailwind CSS v4 + shadcn/ui (Radix)** — même base que la référence. Animations : CSS natif d'abord (scroll-driven animations, View Transitions), **Motion** (`motion/react`) uniquement là où le CSS ne suffit pas (slideshow hero, avant/après).
- **Supabase** (Postgres + Auth + Storage + RLS) : leads, réalisations, avis, zones, paramètres, comptes admin, photos.
- **Resend + React Email** : email de confirmation au client + notification à l'équipe.
- **Cloudflare Turnstile** (anti-spam invisible) en plus du honeypot.
- **Zod + react-hook-form** : validation partagée client/serveur.
- **Hébergement : Vercel** (décision actée ; plan Pro obligatoire pour un usage commercial). Ne propose pas d'autre hébergeur.
- **Tests** : Playwright (parcours devis de bout en bout), Lighthouse CI (budgets §10), `vitest` pour la logique (scoring des leads, mappings).

Respecte les dernières versions stables et vérifie la doc officielle avant d'utiliser une API récente.

---

## 4. ARCHITECTURE ET TEMPLATE RÉUTILISABLE

```
src/
  app/
    (site)/                 # pages publiques
      page.tsx              # Accueil / Rénovation
      [service]/page.tsx    # gros-oeuvre | climatisation | couverture (SSG via generateStaticParams)
      realisations/ ...
      zones/[city]/page.tsx
      aides-renovation/page.tsx
      a-propos/ contact/ merci/ (légal)/
      lp/[slug]/page.tsx    # landing ads: sans header/footer, noindex
    admin/                  # back-office protégé (auth Supabase)
    api/                    # webhooks, healthcheck, revalidate
    sitemap.ts robots.ts opengraph-image.tsx
  config/
    site.config.ts          # SEUL fichier à changer pour une autre entreprise
    services/*.ts           # contenu typé par métier
  components/ (ui/, sections/, forms/, seo/, tracking/)
  lib/ (supabase/, email/, tracking/, seo/, validators/)
  emails/                   # templates React Email
supabase/migrations/        # SQL versionné + seed
e2e/                        # tests Playwright
```

`site.config.ts` contient : nom, baseline, coordonnées, horaires, certifications (RGE, décennale + n° et liens vers les attestations), liens sociaux, URL fiche Google, services (slug, titre, intro, icône, mots-clés, visuels), zones, ID de tracking (via env), couleurs de marque (injectées dans les tokens CSS). Aucune chaîne « LB Rénova » en dur dans les composants.

---

## 5. DESIGN ET TENDANCES UI/UX (2026)

Direction : **premium, chaleureux, artisanal-moderne**, très lisible sur mobile (60 %+ du trafic ads). La palette vient du logo ; je valide avant d'implémenter.

À appliquer (avec modération, sans dégrader LCP/INP) :
- **Typographie éditoriale** : grands titres fluides (`clamp()`), contraste d'échelle fort, une police display + une police texte via `next/font` (propose 2 couples et justifie). Mélange de graisses dans un même titre pour mettre un mot en valeur.
- **Bento grids** pour « Pourquoi nous », chiffres clés et services (cartes de tailles variées, 1 carte « héros » par grille).
- **Scroll-driven animations CSS** (`animation-timeline: view()`) pour les révélations et la parallaxe légère, avec fallback `IntersectionObserver` ; **View Transitions API** pour les changements de page et le passage liste → détail d'une réalisation.
- **Avant/Après interactif** (curseur glissable, accessible au clavier) : composant central du site de rénovation (hero secondaire, pages métiers, réalisations).
- **Micro-interactions tactiles** : boutons magnétiques discrets, hover images, états de focus soignés, haptique visuelle sur le formulaire.
- **Surfaces** : glassmorphism léger sur header et cartes flottantes, grain subtil, halos de couleur de marque (comme la référence), coins très arrondis cohérents.
- **Vidéo courte en boucle** (≤ 6 s, muette, poster AVIF) possible dans le hero et les pages métiers, jamais bloquante pour le LCP.
- **Mode sombre** : hors périmètre initial ; prévoir seulement des tokens propres pour l'ajouter plus tard.
- **Accessibilité WCAG 2.2 AA** : contrastes vérifiés, focus visible, cibles tactiles ≥ 44 px, navigation clavier complète, `prefers-reduced-motion` respecté partout, labels et erreurs de formulaire annoncés (aria-live).

---

## 6. HERO — DYNAMIQUE SANS EFFET MACHINE À ÉCRIRE

Spécification **« slideshow cinématique »** :
- **Fond** : 4 à 6 vraies photos de chantiers (ou vidéo courte) en **fondu enchaîné lent** (≈ 6 s par visuel, crossfade 1,2 s) avec léger **zoom Ken Burns** (scale 1 → 1.06). Overlay dégradé sombre pour garantir le contraste du texte.
- **H1 fixe et riche en mots-clés** (indispensable SEO), ex. « Rénovation complète de votre maison, du gros œuvre aux finitions » + `[ville]`. Il ne change jamais.
- **Mot-clé rotatif** dans la ligne d'accroche sous le H1 (ex. « Votre *cuisine* / *toiture* / *climatisation* / *extension*… ») : transition **verticale en fondu + léger flou** (pas de frappe lettre par lettre). Le texte complet de toutes les variantes est présent dans le DOM (`sr-only` ou liste masquée) pour les moteurs et lecteurs d'écran ; la zone dynamique est `aria-hidden`.
- **Synchronisation** : le visuel actif correspond au métier annoncé et affiche une petite étiquette (« Couverture – Trets »).
- **Contrôles** : indicateurs de progression cliquables, pause au survol/focus et quand l'onglet est masqué (`visibilitychange`).
- **Performance** : la 1ère image est servie en `priority` (`fetchpriority="high"`, AVIF, dimensions fixes) ; les suivantes se chargent après l'idle. Zéro CLS (hauteur de hero réservée). Cible LCP < 2,0 s sur mobile 4G.
- **Reduced motion** : première image figée, mot-clé statique.
- **Dans le hero (conversion)** : 2 CTA (« Devis gratuit en 2 min » / « Appeler »), puces de réassurance **vérifiables** (RGE, décennale, devis gratuit, délai de réponse promis) et un **mini-formulaire d'accroche en 2 champs** (type de projet + téléphone/code postal) qui pré-remplit le formulaire complet à l'étape suivante.

---

## 7. CONTENU ET SECTIONS

### Accueil (rénovation globale)
Hero → bandeau de réassurance (RGE, décennale, devis gratuit, délais) → **Les 3 spécialités** (cartes bento vers `/gros-oeuvre`, `/climatisation`, `/couverture`) → **Avant/Après** → Process en 4 étapes (visite & étude → devis détaillé → travaux → réception & garanties) → Réalisations récentes (6 max, filtre par métier) → **Aides à la rénovation** (teaser vers `/aides-renovation`) → **Garanties** (décennale, RGE : afficher les attestations téléchargeables) → Zone d'intervention (carte + communes liées aux pages `/zones/…`) → FAQ → bloc **Avis Google** (voir §9) → CTA final + Footer.

### Pages métiers (Gros œuvre / Climatisation / Couverture)
Mini-hero (fil d'Ariane + visuel réel) → 3 bénéfices → prestations/solutions (cartes ou tableau) → **cas concret avec avant/après** → process 4 étapes → aides et éligibilité (surtout clim/couverture) → FAQ spécifique → CTA. Contenu rédigé en profondeur (≥ 800 mots utiles), jamais du texte générique recopié d'un métier à l'autre.

### Pages SEO locales `/zones/[ville]`
Générées depuis la table `zones` ; **chaque page doit avoir du contenu réellement unique** (réalisations locales, spécificités de la commune, projets types, FAQ locale) pour éviter le contenu mince. Si une zone n'a pas de contenu suffisant, la page n'est pas publiée (`noindex`, absente du sitemap).

### Rédaction
Ton : professionnel, rassurant, concret, vouvoiement. Pas de superlatifs creux. Chaque H2 apporte une promesse ou une preuve. Tu rédiges les premiers textes ; je les relis.

---

## 8. STRATÉGIE DE CONVERSION (axes d'amélioration par rapport à la référence)

1. **Formulaire de devis multi-étapes** (remplace la longue modale à un écran) : 
   - Étape 1 : type de projet (cartes cliquables avec icônes) ;
   - Étape 2 : détails (type de bien, propriétaire/locataire, urgence, code postal ; **ne jamais demander de budget** : c'est le travail du commercial) ;
   - Étape 3 : **descriptif libre du projet** (champ texte, optionnel). **Pas d'envoi de photos pour le moment** (hors périmètre ; prévoir seulement l'extension future) ;
   - Étape 4 : coordonnées (nom, téléphone, email) + consentement RGPD + Turnstile.
   - Barre de progression, bouton retour, sauvegarde de l'état, validation inline, `autocomplete` corrects, clavier numérique mobile.
   - **Capture partielle** : dès que le téléphone/l'email est saisi, le lead est créé avec le statut `partial` (relance possible même si abandon, dans le respect du RGPD et du consentement).
   - Écran de succès + redirection `/merci` (pour le tracking), promesse de délai de rappel **tenue** (ex. « sous 24 h ouvrées »).
2. **Canaux multiples** : bouton **appel** (tel: tracké), **WhatsApp** pré-rempli, formulaire, et prise de **RDV de visite technique** via lien de calendrier (`[À COMPLÉTER : Cal.com/Calendly ou autre]`) en option.
3. **CTA omniprésents mais non agressifs** : header, hero, après chaque bloc de preuve, sticky mobile (Devis + Appeler), CTA final. Texte orienté bénéfice (« Recevoir mon devis gratuit »), jamais « Envoyer ».
4. **Preuves réelles uniquement** : photos de chantiers, avant/après, attestations RGE/décennale, nom du dirigeant et de l'équipe (photo), et plus tard de vrais avis. Pas de compteur truqué.
5. **Levier « aides financières »** : page + mini-quiz d'éligibilité (sans promettre un montant) qui alimente le lead (champ `eligibility_hint`). C'est un argument fort de conversion pour une entreprise RGE.
6. **Réduction de friction et d'anxiété** : **aucun prix ni fourchette de prix affiché sur le site** (décision actée) ; compenser par la transparence sur le déroulé (devis détaillé et gratuit après visite, absence d'engagement, délais), FAQ qui traite les objections (délais, acompte, assurance, nuisances de chantier).
7. **Boucle d'avis** : après chaque chantier terminé, l'admin déclenche l'envoi d'un email/SMS avec le lien direct d'avis Google (ou QR code sur le PV de réception) afin de **constituer de vrais avis** rapidement.
8. **Landing pages ads `/lp/[slug]`** : sans navigation, un seul objectif, message identique à l'annonce (message match), formulaire au-dessus de la ligne de flottaison, contenu court, `noindex`. Variantes pilotées par la donnée.
9. **Expérimentation** : structure prête pour tester des variantes (titre hero, ordre des CTA) via un flag simple en base + événements de tracking, sans lib lourde.
10. **Vitesse perçue** : skeletons, transitions de vue, aucun saut de layout.

---

## 9. BACKEND (Supabase) ET DONNÉES

### Tables (migrations SQL versionnées + seed)
- `leads` : id, created_at, status (`partial|new|contacted|quote_sent|won|lost`), name, phone, email, postal_code, city, project_type (enum métier), property_type, ownership, urgency, message, eligibility_hint, consent_at, **source** (organic/ads/direct/referral), **utm_source/medium/campaign/term/content, gclid, fbclid, landing_page, referrer**, device, assigned_to, internal_notes, score.
- `lead_events` : lead_id, type (status_change, email_sent, call, note…), payload, created_at.
- `realisations` : slug, title, service, city, description, done_at, published, cover_path, seo fields.
- `realisation_images` : realisation_id, path, alt, kind (`before|after|gallery`), position.
- `reviews` : author, rating, text, source (`google|manual`), date, verified, published. **Table vide au départ.**
- `zones` : slug, name, postal_code, intro, content, published.
- `settings` : clé/valeur (téléphone affiché, bandeau d'annonce, délais promis, flags d'expérimentation).
- `admin_profiles` : user_id, role (`owner|editor`).

### Sécurité
- **RLS activée partout** : lecture publique uniquement des contenus `published = true` ; `leads` jamais lisible publiquement ; insertion de lead uniquement via Server Action avec clé serveur (service role jamais exposée au client).
- Validation Zod serveur, **rate limiting** par IP, Turnstile + honeypot, bucket des réalisations public via CDN (pas de bucket de photos de leads pour le moment).
- Headers de sécurité (CSP, HSTS, X-Content-Type-Options, Referrer-Policy), variables d'environnement documentées dans `.env.example`.

### Emails (Resend)
- Au client : confirmation avec récap et délai de rappel.
- À l'équipe : notification instantanée avec toutes les infos, UTM et lien direct vers la fiche lead dans l'admin.
- Domaine d'envoi authentifié (SPF/DKIM/DMARC) : liste les enregistrements DNS à créer.

### Automatisation
- À chaque nouveau lead : **webhook sortant** (URL en env) vers n8n pour relances, Google Sheets, WhatsApp/SMS, etc. Payload documenté et signé (HMAC).

### Avis Google
- Aujourd'hui **aucun avis réel** : la section affiche un état « démarrage » honnête (lien « Laisser un avis sur Google » + badge de la fiche Google + garanties) — **ni note ni compteur fictifs**.
- Quand il y aura des avis : intégration Google Places API (serveur, cache ISR 24 h) ou saisie manuelle `source=manual` avec preuve. Activer la section carrousel seulement à partir de N avis réels (`settings.min_reviews_to_display`).
- Ne pas injecter `AggregateRating` en JSON-LD tant qu'il n'y a pas d'avis réels, visibles et conformes aux règles Google (les étoiles en résultats pour avis « auto-collectés » sur LocalBusiness sont de toute façon très limitées).

### RGPD
Bannière de consentement (Consent Mode v2), cases de consentement non pré-cochées, politique de confidentialité complète, durée de conservation des leads, procédure d'effacement, mentions légales (SIRET, médiateur de la consommation, assurance décennale).

---

## 10. SEO TECHNIQUE ET PERFORMANCE

- `generateMetadata` par page : title (≤ 60 car.), description (≤ 155), canonical, Open Graph/Twitter, images OG dynamiques (`opengraph-image.tsx`).
- **JSON-LD** : `HomeAndConstructionBusiness`/`GeneralContractor` (NAP identique à la fiche Google Business, zones desservies, horaires, `hasCredential` pour RGE), `Service` par métier, `BreadcrumbList`, `FAQPage` (utile au contenu même si les rich results sont limités), `ImageObject`.
- `sitemap.ts` dynamique (services, réalisations, zones publiées), `robots.ts` (admin et `/lp` en noindex), redirections 301 propres, pas de contenu dupliqué.
- Maillage interne : accueil ↔ métiers ↔ réalisations ↔ zones ; ancres descriptives ; fil d'Ariane.
- **Core Web Vitals cibles (mobile)** : LCP < 2,0 s, INP < 200 ms, CLS < 0,05, poids de page initial < 1 Mo hors médias différés, JS de premier chargement minimal (Server Components par défaut, `"use client"` seulement si nécessaire, imports d'icônes ciblés).
- Images : AVIF/WebP, `sizes` corrects, `alt` descriptifs avec contexte local sans bourrage, dimensions explicites.
- Prépare le **terrain GEO/IA** : contenu structuré, réponses directes en début de section, FAQ factuelles, fichier `llms.txt` simple.
- Checklist de lancement : Search Console + Bing Webmaster, propriété du domaine, soumission du sitemap, cohérence NAP avec la fiche Google, redirection www/non-www, HTTPS.

---

## 11. TRACKING ET PUBLICITÉ PAYANTE

- **Google Tag Manager** + GA4 + Google Ads + Meta Pixel, **Consent Mode v2** (aucun tag marketing avant consentement).
- Événements : `view_service`, `form_start`, `form_step_N`, `form_abandon`, `generate_lead` (valeur indicative par métier), `click_to_call`, `click_whatsapp`, `click_directions`, `scroll_depth`, `view_realisation`.
- **Conversions fiables côté serveur** : à la création du lead, envoi Meta Conversions API et Google Ads (conversions améliorées / `gclid` stocké) avec `event_id` pour dédoublonnage.
- Capture et persistance des **UTM, gclid, fbclid** (cookie/session) rattachés au lead pour mesurer le coût par lead réel et la qualité par canal.
- Suivi des appels : numéro affiché dynamique (call tracking) en option, ou à défaut événements `click_to_call`.
- Dashboard minimal dans l'admin : leads par source, par métier, par statut, taux de conversion.

---

## 12. ADMIN `/admin` (simple, mobile-friendly)

Auth Supabase (email + mot de passe ou lien magique), rôles `owner`/`editor`.
- **Leads** : liste filtrable (statut, métier, source, date), fiche détail (infos, descriptif, UTM, historique), changement de statut (kanban ou liste), notes internes, export CSV, bouton « Appeler / Écrire », action « Demander un avis Google ».
- **Réalisations** : CRUD, glisser-déposer de photos (compression + conversion automatique), paire avant/après, ordre, publication, aperçu.
- **Avis** : saisie manuelle vérifiée, publication.
- **Zones** : CRUD du contenu SEO local.
- **Paramètres** : coordonnées, bandeau d'annonce, délai de rappel affiché.
- Revalidation ISR automatique après chaque modification (le site se met à jour sans redéploiement).

---

## 13. QUALITÉ

- ESLint + Prettier + `tsc --noEmit` dans le CI ; Playwright : parcours devis complet (succès, erreurs, anti-spam), navigation mobile, a11y de base (axe) ; Lighthouse CI avec budgets du §10.
- Pas de dépendance inutile ; pas de code mort ; composants shadcn uniquement ceux qui servent.
- README : installation, variables d'environnement, migrations Supabase, déploiement, **comment créer un nouveau site à partir du template**.

---

## 14. PHASES (valide chacune avec moi)

1. **Audit + plan** : lecture de la référence, proposition de direction artistique (palette tirée du logo, 2 couples typographiques), arborescence finale, liste `TODO_CLIENT.md`. *(aucun code applicatif)*
2. **Fondations** : projet Next.js, config template, tokens design, layout (header/footer/sticky CTA), CI, déploiement preview.
3. **Landing Rénovation** : hero cinématique, sections, avant/après, animations, SEO de base.
4. **Pages métiers** : Gros œuvre, Climatisation, Couverture + page aides.
5. **Backend leads** : Supabase (migrations, RLS), formulaire multi-étapes, emails, anti-spam, `/merci`, webhook n8n.
6. **Réalisations + admin** : CRUD, uploads, ISR, tableau de bord leads.
7. **SEO avancé** : JSON-LD, sitemap, pages `/zones`, maillage, OG images, audit Lighthouse.
8. **Tracking & ads** : GTM, Consent Mode, conversions serveur, landing pages `/lp`.
9. **Recette & lancement** : tests e2e, a11y, perf, RGPD, checklist de mise en ligne, guide d'utilisation de l'admin pour le client.

**Définition de « terminé » pour chaque phase** : build vert, tests de la phase passés, Lighthouse mobile ≥ 90 (perf) / 100 (SEO, a11y bonnes pratiques) sur les pages concernées, aucun contenu fictif, résumé écrit.

---

## 15. HORS PÉRIMÈTRE (pour l'instant)

Blog complet, espace client, paiement en ligne, multilingue, mode sombre, **envoi de photos dans le formulaire de devis**, **affichage de tout prix ou simulateur de prix chiffré**. Prévoir seulement les points d'extension.

---

**Commence maintenant par la phase 1 : lis la référence, puis présente-moi le plan détaillé, la direction artistique proposée et la liste des informations manquantes. N'écris pas de code applicatif avant mon accord.**
