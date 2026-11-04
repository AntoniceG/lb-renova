# TODO_CLIENT — informations à fournir

Toute donnée manquante est représentée dans `src/config/site.ts` par une constante `TODO_…` visible ; le build de production échoue tant qu'il en reste.
Légende : 🔴 bloque une phase · 🟡 nécessaire avant mise en ligne · ⚪ optionnel

## 1. Identité & légal
| Constante | Info | Besoin |
|---|---|---|
| `TODO_LEGAL_NAME` | Raison sociale exacte, forme juridique, capital | 🟡 |
| `TODO_SIRET` / `TODO_RCS` | SIRET, RCS / ville d'immatriculation, n° TVA | 🟡 |
| `TODO_PUBLICATION_DIRECTOR` | Directeur de la publication | 🟡 |
| `TODO_ADDRESS` | Adresse du siège (identique à la fiche Google Business) | 🔴 phase 2 |
| `TODO_MEDIATOR` | Médiateur de la consommation (nom + URL) | 🟡 |
| `TODO_RGPD_CONTACT` | Email de contact RGPD, durée de conservation des leads souhaitée | 🟡 |
| `TODO_REGISTRATION_DATE` | Date d'immatriculation réelle (mentions légales uniquement, jamais en argument commercial) | 🟡 |
| Sens de « depuis plus de 20 ans » (logo) | Ce que ça désigne ; inutilisé tant que non précisé | 🟡 phase 3 |

## 2. Coordonnées
| Constante | Info | Besoin |
|---|---|---|
| `TODO_PHONE` | Téléphone affiché (+ format `tel:`) | 🔴 phase 2 |
| `TODO_EMAIL` | Email public | 🔴 phase 2 |
| `TODO_WHATSAPP` | Numéro WhatsApp + message pré-rempli souhaité | 🟡 |
| `TODO_HOURS` | Horaires d'ouverture / joignabilité | 🟡 |
| `TODO_GOOGLE_BUSINESS_URL` | URL de la fiche Google Business + lien direct « laisser un avis » | 🟡 |
| `TODO_SOCIALS` | Liens réseaux sociaux existants | ⚪ |
| `TODO_CALENDAR_URL` | Lien Cal.com/Calendly pour les visites techniques | ⚪ |
| ~~`TODO_CALLBACK_DELAY`~~ | ✅ Délai de rappel affiché : **« sous 48 h »** (`promise.callbackDelay`). L'équipe s'engage à le tenir. | fait |

## 3. Zone d'intervention
- ✅ Ville de base : **Aix-en-Provence**, rayon **50 km**
- **Communes prioritaires** pour les pages `/zones` (3–5). Proposition à valider : Aix-en-Provence, Marseille, Gardanne, Salon-de-Provence, Pertuis — 🔴 phase 2
- **Adresse du siège** (identique à la fiche Google Business) — 🔴 phase 2
- Pour chaque commune lancée : 1 réalisation locale réelle, spécificités du bâti, projets types — 🟡 phase 7

## 3 bis. Histoire de famille (storytelling « depuis 1945 »)
Je n'invente aucun détail ; j'ai besoin de :
- Prénom/nom du grand-père, **année et lieu d'arrivée en France**, ce que « 1945 » désigne exactement — 🔴 phase 3
- Rôle de la génération intermédiaire (le logo dit « de père en fils ») — 🔴 phase 3
- Prénoms des petits-enfants aujourd'hui maçons dans l'entreprise, leur parcours/formation — 🔴 phase 3
- Photos (archives familiales, outils, pierres taillées, équipe actuelle) avec autorisation d'usage — 🟡
- Tonalité souhaitée (sobre/émouvant), éléments à ne pas mentionner — 🟡
- Formulation validée : « histoire/savoir-faire de famille depuis 1945 », **pas** « entreprise fondée en 1945 »

## 4. Certifications & garanties
- RGE : badge de réassurance seul, **sans détails de certificat** (décision). Il reste **désactivé** (`certifications.rge.enabled = false`) jusqu'à ta confirmation que l'entreprise détient bien la qualification — 🟡 phase 3
- Décennale : **assureur, n° de police, activités couvertes, zone de validité** + PDF de l'attestation — 🔴 phase 3
- Autres labels/qualifications éventuels (Qualibat, QualiPAC, etc.) — ⚪

## 5. Identité visuelle
- Logo final (SVG si possible, versions fond clair / fond sombre / favicon carré) — 🔴 phase 2 (provisoire accepté)
- ✅ Parti pris : bleu-blanc-rouge, gage de qualité ; ✅ typographie : Bricolage Grotesque + Figtree
- Palette exacte (valeurs) : à figer sur le logo final — 🟡 phase 2/3

## 6. Photos & vidéos
- Dossier source des photos de chantiers (originaux haute définition) — 🔴 phase 3
- Pour chaque photo : métier concerné, commune, date approximative, **autorisation d'utilisation** si des personnes/façades identifiables apparaissent — 🟡
- Paires **avant/après** (même cadrage si possible), minimum 3 — 🔴 phase 3
- 4 à 6 visuels pour le hero (un par métier : rénovation, gros œuvre, clim, couverture) — 🔴 phase 3
- Photo du dirigeant + de l'équipe, prénoms/rôles — 🟡
- Vidéo courte (≤ 6 s) — ⚪

## 7. Contenu
- Présentation du dirigeant et de l'histoire de l'entreprise (faits vérifiables uniquement) — 🟡 phase 3/4
- Prestations réellement proposées par métier (liste précise ; ex. clim : marques/gammes installées ? maintenance ?) — 🔴 phase 4
- Spécialistes par corps de métier : internes ou sous-traitants ? (impacte la formulation « entreprise générale » et la garantie) — 🔴 phase 4
- ~~Textes aides à la rénovation~~ : abandonnés (aucune aide mentionnée sur le site)
- Objections fréquentes entendues en rendez-vous (pour la FAQ) — 🟡

## 8. Comptes & accès techniques
| Service | Action | Phase |
|---|---|---|
| Nom de domaine + accès DNS | Achat/transfert, choix www vs non-www | 2 |
| GitHub | Dépôt (privé) | 2 |
| Vercel **Pro** | Création du compte/équipe | 2 |
| Supabase | Projet dédié (plan payant en prod) | 5 |
| Resend | Compte + domaine d'envoi (SPF/DKIM/DMARC à créer chez le registrar) | 5 |
| Cloudflare Turnstile | Site key / secret | 5 |
| n8n | URL du webhook + secret HMAC | 5 |
| ~~Upstash (rate limit)~~ | Abandonné : limitation de débit via le pare-feu Vercel (plan Pro) + honeypot + Turnstile. Upstash seulement en cas de spam avéré. | — |
| Google Tag Manager, GA4 | Conteneur + propriété | 8 |
| Google Ads | Compte, ID de conversion, accès | 8 |
| Meta | Pixel ID, token Conversions API, accès Business Manager | 8 |
| Google Search Console / Bing Webmaster | Vérification du domaine | 9 |
| Google Places (optionnel, plus tard) | Clé API pour les avis | après lancement |

## 9. Décisions business
- Qui traite les leads et à quelle vitesse ? (impacte la promesse affichée et le tableau de bord) — 🔴 phase 5
- Valeur indicative d'un lead par métier (pour `generate_lead` dans Google Ads) — 🟡 phase 8
- Message-match des annonces prévues (mots-clés ciblés → slugs `/lp/…`) — 🟡 phase 8
- ~~Politique de relance des leads partiels~~ : ✅ **option A** actée. Rien n'est enregistré avant la validation explicite de l'étape contact (mention d'information visible). Une demande incomplète apparaît dans l'admin avec le statut « incomplet », l'équipe peut rappeler une fois, **aucune relance automatique**, suppression au bout de 30 jours si elle n'est pas finalisée.

## 10. Ajouts phase 3
- `TODO_CALLBACK_DELAY` : tant qu'il n'est pas renseigné, la puce « Rappel … » et la question FAQ associée sont masquées (et le build de production échoue).
- Photos de chantiers, paires avant/après, vidéo : **reportées** (aucune pour l'instant). Les sections avant/après et réalisations restent en démo, masquées en production.
- Lien d'attestation décennale (PDF dans `public/`) : le bouton de téléchargement n'apparaît qu'une fois `certifications.decennale.attestationUrl` renseigné.
- Fiche Google Business : le bouton « Voir notre fiche Google » n'apparaît qu'une fois l'URL renseignée.

## 11. Relecture des textes de la phase 4 (avant mise en ligne)
Les trois pages métiers (`src/content/services/*.ts`, ≥ 800 mots chacune) sont rédigées avec des informations générales de métier et de réglementation, **sans prix, délai chiffré, aide financière ni chiffre sur l'entreprise**. À relire par toi :
- **Exactitude métier** : ce qui est décrit correspond-il à votre façon de travailler (étaiement, étude de structure, écran de sous-toiture, sarking, tuiles canal/romane, etc.) ?
- **Climatisation** : le texte rappelle que la manipulation des fluides frigorigènes est réservée aux professionnels titulaires de l'attestation de capacité. **Confirme que l'entreprise (ou son installateur) la détient** avant publication, sinon on retire cette phrase.
- **Seuils d'urbanisme** (déclaration préalable / permis / architecte) : indicatifs et susceptibles d'évoluer ; le texte renvoie à la mairie.
- **Page `/qui-sommes-nous`** : texte actuel limité aux faits connus (grand-père venu d'Italie, tailleur de pierre ; petits-enfants maçons dans l'entreprise). Récit complet à fournir ; équipe (noms, rôles, photos) à fournir pour activer la section.
- **Cas concret avant/après** des pages métiers : section en démo (masquée en production) en attendant de vraies photos.

## 12. Préparation phase 5 (infrastructure)
- ✅ Domaine `lb-renova.fr` (OVH, DNS OVH) relié à Vercel ; `www` redirige vers le domaine sans `www`.
- ✅ Resend : domaine vérifié (région Europe), expéditeur `devis@lb-renova.fr`, réponses via la redirection OVH vers une boîte existante.
- ✅ Supabase : projet `lb-renova` (Paris, plan Free). Passer en **Pro** avant le lancement (mise en pause après inactivité, pas de sauvegardes sur le plan Free).
- ✅ Turnstile, variables d'environnement Vercel, workflow n8n `n8n/lead-intake.workflow.json` (voir `docs/N8N_WEBHOOK.md`).
- 🔴 **Plan Vercel : Hobby.** Usage commercial interdit sur Hobby : passer en **Pro** avant la mise en ligne.
- 🟡 Boîte email professionnelle (OVH Email Pro / MX Plan ou Google Workspace) pour remplacer la redirection avant le lancement.
- 🟡 Données de l'entreprise encore en `TODO_` (téléphone, adresse, horaires, raison sociale, SIRET, assureur, médiateur, contact RGPD, fiche Google) : à ajouter avant le lancement, elles ne bloquent pas la phase 5.

## 13. Phase 5 : points à valider
- 🟡 **Durées de conservation** (RGPD) : demandes incomplètes 30 jours, leads 3 ans après la dernière mise à jour. À faire valider ; la purge quotidienne n'est pas encore planifiée (`supabase/optional/schedule_purge_expired_leads.sql`, à appliquer après validation).
- 🟡 **Texte de consentement et d'information** du formulaire (`components/quote/quote-form.tsx`) : à relire. Une politique de confidentialité complète (page dédiée) reste à rédiger en phase 9.
- 🟡 **Leads partiels (option A)** : le contact étant la dernière étape, le statut « incomplet » n'est pas utilisé aujourd'hui. Décision à prendre : garder l'ordre actuel, ou demander le contact à l'étape 3 et rendre la description facultative à l'étape 4.
- 🟡 **Email de notification** : envoyé à une adresse de test (`LEADS_NOTIFICATION_EMAIL`), à remplacer par la boîte de l'équipe.
- ⚪ **n8n** : le workflow répond 200 puis s'arrête sur un nœud vide. À brancher (alerte Telegram, tableur…) selon le besoin.
