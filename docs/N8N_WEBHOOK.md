# Webhook n8n — réception des leads

Workflow : `n8n/lead-intake.workflow.json` (« LB Rénova - Réception des leads »), importable dans n8n ou créé par l'API.

## Contrat

- **Méthode** : `POST` sur `N8N_WEBHOOK_URL` (`…/webhook/lb-renova-leads`).
- **Corps** : JSON, par exemple `{ "event": "lead.created", "sentAt": "…", "lead": { … } }`. Le contenu exact est défini en phase 5.
- **En-têtes obligatoires** :
  - `X-LB-Timestamp` : heure d'envoi en secondes Unix (10 chiffres). Refusé au-delà de ±5 minutes.
  - `X-LB-Signature` : `sha256=` + HMAC-SHA256 en hexadécimal de la chaîne `"<timestamp>.<corps brut>"`, avec `N8N_WEBHOOK_SECRET` comme clé.
- **Réponses** : `200 {"ok":true}` si la signature est valide, `401 {"ok":false}` sinon (la cause précise n'est visible que dans l'historique d'exécution n8n).

Signature côté site (Node) :

```ts
import { createHmac } from "node:crypto";

const timestamp = Math.floor(Date.now() / 1000).toString();
const signature =
  "sha256=" + createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
```

Le corps signé doit être exactement la chaîne envoyée (pas de re-sérialisation).

## Installation dans n8n

1. Importer le fichier (ou le créer par l'API), puis ouvrir le nœud **Calculer HMAC**.
2. Remplacer `__COLLER_LE_SECRET_ICI__` par la valeur de `N8N_WEBHOOK_SECRET`. Tant que ce marqueur est présent, toutes les requêtes sont rejetées (`secret_not_configured`).
3. Activer le workflow.
4. Brancher la suite (notification, tableur, CRM…) après le nœud **Lead reçu - brancher la suite ici**.

## Notes

- Le module `crypto` est interdit dans les nœuds Code de l'instance auto-hébergée : la signature est calculée par le nœud **Crypto** natif, la comparaison à temps constant est faite dans un nœud Code sans module externe.
- Le secret figure dans le nœud Crypto du workflow : ne pas exporter le workflow vers un dépôt public avec le secret collé.
