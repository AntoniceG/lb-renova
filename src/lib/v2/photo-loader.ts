/**
 * Adresses des photos de chantier DÉJÀ fabriquées (voir design-v2/preparer-les-photos.mjs) :
 * `photo-N-360`, `-480`, `-640`, `-750`, `-960` en .avif (le plus léger) et .webp (repli), et l'original
 * `photo-N` au-delà de 960 px. Rien n'est recalculé par le serveur : avant, chaque photo était
 * fabriquée à la demande à la première visite, d'où des photos qui arrivaient une à une.
 * Ces deux fonctions sont données à `getImageProps` (voir components/v2/photo-image.tsx).
 */
const WIDTHS = [360, 480, 640, 750, 960];

interface LoaderProps {
  src: string;
  width: number;
}

function variant(src: string, width: number, extension: "avif" | "webp"): string {
  const base = src.replace(/\.webp$/, "");
  const bucket = WIDTHS.find((candidate) => candidate >= width);
  return bucket ? `${base}-${bucket}.${extension}` : `${base}.${extension}`;
}

export const avifLoader = ({ src, width }: LoaderProps) => variant(src, width, "avif");
export const webpLoader = ({ src, width }: LoaderProps) => variant(src, width, "webp");
