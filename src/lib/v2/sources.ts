import type { WaterSource } from "./water";

/**
 * Photos du port (retouchées par le client, dossier `design-v2/`) et leurs masques d'eau.
 * Les masques sont tracés à la main : bord bas des coques de bateaux = début de l'eau.
 * Écran large (≥ carré) → paysage ; téléphone en portrait → portrait.
 */
export const PORT_LANDSCAPE: WaterSource = {
  image: "/v2/port-large.webp", // 1672 × 941
  mask: "/v2/masque-large.png",
  horizon: 0.685,
};

export const PORT_PORTRAIT: WaterSource = {
  image: "/v2/port-portrait.webp", // 1024 × 1536
  mask: "/v2/masque-portrait.png",
  horizon: 0.625,
};

/** Media query commune : vrai quand l'écran est plus large que haut. */
export const LANDSCAPE_QUERY = "(min-aspect-ratio: 1/1)";
