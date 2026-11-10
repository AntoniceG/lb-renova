// Fabrique l'image de partage et les icônes du site à partir du port et du logo.
//
// Usage :  node design-v2/preparer-les-icones.mjs
//
// Produit :
//   public/partage.jpg       1200 x 630 : l'aperçu quand on partage un lien (réseaux, WhatsApp, Google)
// et, dans src/app/ (Next.js les repère à leur nom et ajoute les balises tout seul) :
//   icon.png                                  192 x 192 : l'icône de l'onglet du navigateur (légère : le
//                                             navigateur la télécharge pendant le chargement de la page)
//   apple-icon.png                            180 x 180 : l'icône sur l'écran d'accueil d'un iPhone
//   src/lib/email/logo.ts                      le logo (PNG 240 px, texte blanc) intégré aux e-mails, en base64
// À relancer si le logo ou la photo du port change.
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const LARGEUR = 1200;
const HAUTEUR = 630;

// --- Image de partage : la photo du port assombrie, le logo au centre.
const photo = await sharp("public/v2/port-large.webp")
  .resize(LARGEUR, HAUTEUR, { fit: "cover", position: "centre" })
  .toBuffer();
const voile = Buffer.from(
  `<svg width="${LARGEUR}" height="${HAUTEUR}" xmlns="http://www.w3.org/2000/svg">
     <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0" stop-color="#071433" stop-opacity="0.5"/>
       <stop offset="1" stop-color="#071433" stop-opacity="0.8"/>
     </linearGradient></defs>
     <rect width="100%" height="100%" fill="url(#g)"/>
   </svg>`,
);
const logoPartage = await sharp("public/v2/logo-20ans.webp").resize(470, 470).toBuffer();
const partage = await sharp(photo)
  .composite([
    { input: voile },
    { input: logoPartage, left: (LARGEUR - 470) / 2, top: (HAUTEUR - 470) / 2 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();
await sharp(partage).toFile("public/partage.jpg");

// --- Icônes : monogramme LB (voir la fonction icone).
/**
 * Icône du site : monogramme « LB » blanc sur carré marine, filet bleu-blanc-rouge dessous. Les lettres
 * sont dessinées en traits (pas de police : elles s'affichent pareil partout) et lisibles même à 16 px.
 * Couleurs : marine de la marque (#1A2A5E), bleu vif, blanc, rouge de la marque.
 */
async function icone(taille, arrondi, sortie) {
  const svg = `<svg width="${taille}" height="${taille}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="${arrondi}" fill="#1A2A5E"/>
    <g fill="none" stroke="#ffffff" stroke-width="46">
      <path d="M112 120 V350 H232"/>
      <path d="M296 120 V352"/>
      <path d="M296 143 H356 a49 49 0 0 1 0 98 H296"/>
      <path d="M296 241 H368 a55 55 0 0 1 0 111 H296"/>
    </g>
    <rect x="90" y="410" width="110" height="26" fill="#3F6FE0"/>
    <rect x="200" y="410" width="112" height="26" fill="#ffffff"/>
    <rect x="312" y="410" width="110" height="26" fill="#D6322A"/>
  </svg>`;
  await sharp(Buffer.from(svg)).resize(taille, taille).png({ compressionLevel: 9 }).toFile(sortie);
}
await icone(192, 44, "src/app/icon.png");
await icone(180, 0, "src/app/apple-icon.png");

// --- favicon.ico : Google le demande en premier ; 48 px (multiple de 48, exigé par Google).
// Un .ico peut contenir directement une image PNG : on l'enveloppe dans l'en-tête du format.
await icone(48, 10, "design-v2/.favicon-48.png");
const png48 = readFileSync("design-v2/.favicon-48.png");
const entete = Buffer.alloc(22);
entete.writeUInt16LE(0, 0); // réservé
entete.writeUInt16LE(1, 2); // type : icône
entete.writeUInt16LE(1, 4); // une seule image
entete[6] = 48; // largeur
entete[7] = 48; // hauteur
entete.writeUInt16LE(1, 10); // plans
entete.writeUInt16LE(32, 12); // bits par pixel
entete.writeUInt32LE(png48.length, 14); // taille de l'image
entete.writeUInt32LE(22, 18); // position de l'image
writeFileSync("src/app/favicon.ico", Buffer.concat([entete, png48]));
unlinkSync("design-v2/.favicon-48.png");

// --- E-mails : le logo à texte blanc (sur le bandeau marine), joint en ligne à chaque message.
// Un PNG (le WebP n'est pas lu partout, Outlook notamment), léger : 240 px pour un affichage à 120 px.
const logoEmail = await sharp("public/v2/logo-20ans.webp")
  .resize(240, 240)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
writeFileSync(
  "src/lib/email/logo.ts",
  `// Généré par design-v2/preparer-les-icones.mjs : ne pas modifier à la main.
// Logo (PNG 240 x 240, texte blanc, fond transparent) joint en ligne aux e-mails.
export const EMAIL_LOGO_BASE64 =
  "${logoEmail.toString("base64")}";
`,
);
console.log(`Logo des e-mails : ${Math.round(logoEmail.length / 1024)} Ko.`);

console.log("Image de partage (public/partage.jpg) et icônes (src/app/) produites.");
