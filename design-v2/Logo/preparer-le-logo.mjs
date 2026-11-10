// Prépare les deux logos du site V2 à partir des fichiers du client.
//
// Usage :  node design-v2/Logo/preparer-le-logo.mjs "#0A3BA6"
//
// Produit, dans public/v2/ :
//   logo-20ans.webp        version pour FONDS SOMBRES (texte blanc) : hero, pied de page
//                       (source : LB_RENOVA_20_ans_sombre.svg, une image sur fond noir)
//   logo-20ans-clair.webp  version pour FONDS CLAIRS (texte marine) : en-tête blanc
//                       (source : LB_RENOVA_20_ans_clair.svg, une image sur fond blanc)
// avec, pour les deux :
//   1. un vrai fond transparent ;
//   2. le bleu du rond repeint avec le code couleur donné, en gardant un léger dégradé.
//
// Les fichiers du client ne sont jamais modifiés : pour changer de bleu, on relance la commande.

import { readFileSync } from "node:fs";
import sharp from "sharp";

const SOURCE_SOMBRE = "design-v2/Logo/LB_RENOVA_20_ans_sombre.svg";
const SOURCE_CLAIR = "design-v2/Logo/LB_RENOVA_20_ans_clair.svg";
const DESTINATION_SOMBRE = "public/v2/logo-20ans.webp";
const DESTINATION_CLAIR = "public/v2/logo-20ans-clair.webp";

/** Sous cette valeur, c'est du bruit de compression du fond : on le rend transparent. */
const NOISE_FLOOR = 16;
/** Valeur la plus claire du bleu d'origine du rond : un pixel à ce niveau est pleinement opaque. */
const BLUE_PEAK = 168;
/** Sur fond clair : le bleu du rond est plus vif que le bleu marine du texte (qui reste tel quel). */
const RING_MIN_BRIGHTNESS = 120;

const hex = process.argv[2] ?? "";
if (!/^#[0-9a-f]{6}$/i.test(hex)) {
  console.error('Donnez un code couleur, par exemple : node preparer-le-logo.mjs "#0A3BA6"');
  process.exit(1);
}

const target = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
const dark = target.map((value) => value * 0.82);
const light = target.map((value) => Math.min(255, value * 1.12));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Le bleu du rond : la nouvelle couleur, un peu plus claire en haut du dégradé qu'en bas. */
function ringPaint(green, blue, channel) {
  const position = clamp((green / blue - 0.22) / 0.12, 0, 1);
  return Math.round(dark[channel] + (light[channel] - dark[channel]) * position);
}

async function readPixels(sourcePath) {
  const svg = readFileSync(sourcePath, "utf8");
  const encoded = /base64,([^"]+)"/.exec(svg)?.[1];
  if (!encoded) {
    console.error(`Aucune image trouvée dans ${sourcePath}.`);
    process.exit(1);
  }
  return sharp(Buffer.from(encoded, "base64"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function save({ data, info }, destination) {
  // 740 px suffisent (le logo s'affiche à 368 px au plus, soit 736 px sur un écran très net) : fichier plus léger.
  const result = await sharp(data, { raw: info })
    .resize(740, 740, { kernel: "lanczos3" })
    .webp({ quality: 78, alphaQuality: 85, effort: 6, smartSubsample: true })
    .toFile(destination);
  console.log(`${destination} (${Math.round(result.size / 1024)} Ko)`);
}

/** Logo sur fond NOIR : le noir devient de la transparence, le blanc et le rouge restent nets. */
async function logoSombre() {
  const pixels = await readPixels(SOURCE_SOMBRE);
  const { data } = pixels;

  for (let i = 0; i < data.length; i += 4) {
    const [red, green, blue] = [data[i], data[i + 1], data[i + 2]];
    const peak = Math.max(red, green, blue);

    if (peak < NOISE_FLOOR) {
      data[i + 3] = 0;
      continue;
    }

    const isBlue = blue > 2.2 * green && blue > 4 * red + 8;
    if (isBlue) {
      // Le bleu du rond est sombre : on le garde plein (opaque), seuls les bords s'adoucissent.
      data[i + 3] = Math.round(255 * clamp(peak / BLUE_PEAK, 0, 1));
      for (let channel = 0; channel < 3; channel++) {
        data[i + channel] = ringPaint(green, blue, channel);
      }
      continue;
    }

    // Blanc, rouge : le noir derrière se transforme en transparence (alpha = plus clair des canaux).
    const boost = 255 / peak;
    data[i] = Math.min(255, Math.round(red * boost));
    data[i + 1] = Math.min(255, Math.round(green * boost));
    data[i + 2] = Math.min(255, Math.round(blue * boost));
    data[i + 3] = peak;
  }

  await save(pixels, DESTINATION_SOMBRE);
}

/** Logo sur fond BLANC : le blanc devient de la transparence, le marine et le rouge restent nets. */
async function logoClair() {
  const pixels = await readPixels(SOURCE_CLAIR);
  const { data } = pixels;

  for (let i = 0; i < data.length; i += 4) {
    const [red, green, blue] = [data[i], data[i + 1], data[i + 2]];
    const lightest = Math.min(red, green, blue);

    if (255 - lightest < 12) {
      data[i + 3] = 0;
      continue;
    }

    // « Couleur vers transparence » : on retrouve la couleur pure et la part de transparence.
    const alpha = 1 - lightest / 255;
    const pure = [(red - lightest) / alpha, (green - lightest) / alpha, (blue - lightest) / alpha];
    const isRing =
      pure[2] > 2.2 * pure[1] &&
      pure[2] > 4 * pure[0] + 8 &&
      Math.max(...pure) >= RING_MIN_BRIGHTNESS;

    for (let channel = 0; channel < 3; channel++) {
      data[i + channel] = isRing
        ? ringPaint(pure[1], pure[2], channel)
        : Math.round(clamp(pure[channel], 0, 255));
    }
    data[i + 3] = Math.round(255 * alpha);
  }

  await save(pixels, DESTINATION_CLAIR);
}

console.log(`Logos V2, bleu du rond ${hex.toUpperCase()} :`);
await logoSombre();
await logoClair();
