// Prépare les photos de chantier pour le site V2.
//
// Usage :  node design-v2/preparer-les-photos.mjs
//
// Lit  design-v2/Photo de chantier/photo_N_*.jpg  (originaux, non versionnés : trop lourds)
// et écrit :
//   public/v2/realisations/photo-N.webp    (redressée, au plus 1600 px de large, qualité 80)
//   src/lib/v2/photos.json                 (largeur et hauteur de chaque photo, pour la mise en page)
//
// Les vidéos du dossier sont volontairement ignorées (trop lourdes pour le site).

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "design-v2/Photo de chantier";
const OUTPUT_DIR = "public/v2/realisations";
const DIMENSIONS_FILE = "src/lib/v2/photos.json";
const MAX_WIDTH = 1600;

mkdirSync(OUTPUT_DIR, { recursive: true });

const photos = readdirSync(SOURCE_DIR)
  .map((name) => ({ name, number: Number(/^photo_(\d+)_/.exec(name)?.[1]) }))
  .filter(({ name, number }) => /\.jpe?g$/i.test(name) && Number.isInteger(number))
  .sort((a, b) => a.number - b.number);

const dimensions = {};
let total = 0;

for (const { name, number } of photos) {
  const info = await sharp(path.join(SOURCE_DIR, name))
    .rotate() // applique l'orientation EXIF (photos prises à la verticale)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(path.join(OUTPUT_DIR, `photo-${number}.webp`));
  dimensions[number] = { width: info.width, height: info.height };
  total += info.size;
}

writeFileSync(DIMENSIONS_FILE, `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(`${photos.length} photos converties (${Math.round(total / 1024 / 1024)} Mo au total).`);
