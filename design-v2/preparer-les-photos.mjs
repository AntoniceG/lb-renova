// Prépare les photos de chantier pour le site.
//
// Usage :  node design-v2/preparer-les-photos.mjs           (ne fabrique que ce qui manque)
//          node design-v2/preparer-les-photos.mjs --force   (refait tout : compter 4 minutes, l'AVIF est lent)
//
// Lit  design-v2/Photo de chantier/photo_N_*.jpg  (originaux, non versionnés : trop lourds)
// et écrit, dans public/v2/realisations/ :
//   photo-N.webp, photo-N.avif            photo redressée, au plus 1600 px de large
//   photo-N-360 / -480 / -640 / -750 / -960   versions légères, DÉJÀ fabriquées, en .avif (le plus léger)
//                                         et en .webp (pour les navigateurs sans AVIF) : le
//                                         téléphone télécharge la petite, sans attendre le serveur
// et src/lib/v2/photos.json : largeur, hauteur et aperçu flou de chaque photo (mise en page, et
// image floue affichée pendant le chargement).
// Les largeurs ci-dessous doivent rester celles de src/lib/v2/photo-loader.ts.
//
// Les vidéos du dossier sont volontairement ignorées (trop lourdes pour le site).

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "design-v2/Photo de chantier";
const OUTPUT_DIR = "public/v2/realisations";
const DIMENSIONS_FILE = "src/lib/v2/photos.json";
const MAX_WIDTH = 1600;
const WIDTHS = [360, 480, 640, 750, 960];
/** Sans `--force`, les versions déjà fabriquées ne sont pas refaites (l'AVIF est lent). */
const FORCE = process.argv.includes("--force");
/** Qualités choisies pour un rendu équivalent : l'AVIF est ~40 % plus léger à qualité égale. */
const WEBP = { quality: 62, effort: 6, smartSubsample: true };
const AVIF = { quality: 48, effort: 3 };

mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Écrit un fichier en réessayant : sous Windows, l'antivirus ou l'indexation ouvrent parfois un
 * fichier à peine écrit et l'écriture échoue un instant (« unable to open for write »).
 */
async function save(buffer, file) {
  for (let attempt = 1; ; attempt++) {
    try {
      writeFileSync(file, buffer);
      return;
    } catch (error) {
      if (attempt >= 6) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }
}

const photos = readdirSync(SOURCE_DIR)
  .map((name) => ({ name, number: Number(/^photo_(\d+)_/.exec(name)?.[1]) }))
  .filter(({ name, number }) => /\.jpe?g$/i.test(name) && Number.isInteger(number))
  .sort((a, b) => a.number - b.number);

const dimensions = {};

for (const { name, number } of photos) {
  const source = path.join(SOURCE_DIR, name);
  // applique l'orientation EXIF (photos prises à la verticale)
  const open = (width) => sharp(source).rotate().resize({ width, withoutEnlargement: true });

  const full = await open(MAX_WIDTH)
    .webp({ quality: 80, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  await save(full.data, path.join(OUTPUT_DIR, `photo-${number}.webp`));
  const fullAvifFile = path.join(OUTPUT_DIR, `photo-${number}.avif`);
  if (FORCE || !existsSync(fullAvifFile)) {
    await save(await open(MAX_WIDTH).avif({ quality: 55, effort: 3 }).toBuffer(), fullAvifFile);
  }

  for (const width of WIDTHS) {
    const webpFile = path.join(OUTPUT_DIR, `photo-${number}-${width}.webp`);
    if (FORCE || !existsSync(webpFile))
      await save(await open(width).webp(WEBP).toBuffer(), webpFile);
    const avifFile = path.join(OUTPUT_DIR, `photo-${number}-${width}.avif`);
    if (FORCE || !existsSync(avifFile))
      await save(await open(width).avif(AVIF).toBuffer(), avifFile);
  }

  // Aperçu flou minuscule (16 px de large), affiché pendant que la vraie photo arrive.
  const blur = await open(16).webp({ quality: 35 }).toBuffer();
  dimensions[number] = {
    width: full.info.width,
    height: full.info.height,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

writeFileSync(DIMENSIONS_FILE, `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(`${photos.length} photos traitées.`);
