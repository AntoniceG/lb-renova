// Prépare le logo du site V2 à partir du fichier du client (version pour fonds sombres).
//
// Usage :  node design-v2/Logo/preparer-le-logo.mjs "#0A3BA6"
//
// Lit  design-v2/Logo/LB_RENOVA_logo_sombre_v2.svg  (une image PNG sur fond noir, dans un SVG)
// et écrit  public/v2/logo-v2.webp  (celui qu'affiche le site), avec :
//   1. un vrai fond transparent (le noir disparaît, le blanc et le rouge restent nets) ;
//   2. le bleu du rond repeint avec le code couleur donné, en gardant un léger dégradé.
//
// Le fichier du client n'est jamais modifié : pour changer de bleu, on relance simplement la commande.

import { readFileSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "design-v2/Logo/LB_RENOVA_logo_sombre_v2.svg";
const DESTINATION = "public/v2/logo-v2.webp";

/** Sous cette valeur, c'est du bruit de compression du fond noir : on le rend transparent. */
const NOISE_FLOOR = 16;
/** Valeur la plus claire du bleu d'origine du rond : un pixel à ce niveau est pleinement opaque. */
const BLUE_PEAK = 168;

const hex = process.argv[2] ?? "";
if (!/^#[0-9a-f]{6}$/i.test(hex)) {
  console.error('Donnez un code couleur, par exemple : node preparer-le-logo.mjs "#0A3BA6"');
  process.exit(1);
}

const target = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
const dark = target.map((value) => value * 0.82);
const light = target.map((value) => Math.min(255, value * 1.12));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const svg = readFileSync(SOURCE, "utf8");
const encoded = /base64,([^"]+)"/.exec(svg)?.[1];
if (!encoded) {
  console.error("Aucune image trouvée dans le fichier SVG.");
  process.exit(1);
}

const { data, info } = await sharp(Buffer.from(encoded, "base64"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

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
    const position = clamp((green / blue - 0.22) / 0.12, 0, 1);
    for (let channel = 0; channel < 3; channel++) {
      data[i + channel] = Math.round(dark[channel] + (light[channel] - dark[channel]) * position);
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

const result = await sharp(data, { raw: info })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(DESTINATION);

console.log(
  `Logo v2 prêt, bleu ${hex.toUpperCase()} : ${DESTINATION} (${Math.round(result.size / 1024)} Ko)`,
);
