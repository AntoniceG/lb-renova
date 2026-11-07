import { siteConfig } from "@/config/site.config";
import { EXPERTISES } from "./expertises";
import dimensions from "./photos.json";

export interface Photo {
  number: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Album {
  slug: string;
  title: string;
  intro: string;
  /** La première photo sert de couverture. */
  photos: readonly Photo[];
}

/** Un album n'est affiché (et son badge cliquable) qu'à partir de ce nombre de photos. */
export const MIN_PHOTOS = 2;

/**
 * Description de chaque photo (texte alternatif : lecteurs d'écran et référencement).
 * Les numéros sont ceux du dossier « Photo de chantier » ; 13, 14, 22 et 29 ont été écartées.
 */
const ALT: Readonly<Record<number, string>> = {
  1: "Toiture en tuiles canal rouges",
  2: "Gros plan sur des tuiles canal en terre cuite",
  3: "Tuiles rouges posées sur une toiture neuve",
  4: "Cuisine rénovée avec crédence en carrelage vert et plan de travail en bois",
  5: "Cuisine ouverte avec verrière noire et crédence verte",
  6: "Mur de soutènement en pierre au bord d'une terrasse en bois",
  7: "Escalier d'entrée habillé de parement en pierre",
  8: "Dalle béton coulée dans son coffrage en bois",
  9: "Mur en blocs de béton en cours de construction",
  10: "Escalier en pierre devant une baie vitrée",
  11: "Façade de maison aux volets bleus",
  12: "Sol de salon en carrelage imitation parquet",
  15: "Grande pièce au sol carrelé imitation parquet et plafond à poutres",
  16: "Climatisation murale installée dans une pièce en cours de finition",
  17: "Pièce lumineuse au sol carrelé brillant, grandes baies vitrées",
  18: "Séjour avec plafond à poutres apparentes et baies vitrées",
  19: "Ouverture dans un mur donnant sur une pièce aux fenêtres d'angle",
  20: "Deux artisans posant un parement en pierre sous une fenêtre",
  21: "Mur en blocs de béton enduit sur une terrasse",
  23: "Reprise d'une fissure dans un mur en parpaings",
  24: "Mur d'angle en blocs de béton, avant enduit",
  25: "Cloisons en plaques de plâtre dans une pièce ouverte",
  26: "Ossature en béton armé d'une extension en construction",
  27: "Ouverture dans un mur en blocs avec linteau et étais",
  28: "Petit bâtiment enduit équipé d'un volet roulant",
  30: "Salon rénové avec puits de lumière et ouverture sur la pièce de vie",
  31: "Tuiles canal stockées sur une toiture en cours de rénovation",
  32: "Tuiles alignées sur un support de toiture avant la pose",
  33: "Pose de tuiles sur une toiture à côté d'un mur en pierre",
  34: "Charpente en bois ouverte au ciel, avec une échelle",
  35: "Petit bâtiment blanc avec dalle en préparation",
  36: "Dalle béton lissée et son coffrage en bois",
  37: "Ferraillage et coffrage d'une dalle béton",
  38: "Mini-pelle et compacteur sur un chantier de terrassement",
  39: "Pièce vidée et protégée par des bâches avant les travaux de peinture",
  40: "Façade moderne avec verrière à l'étage, enduit à reprendre",
  41: "Façade à rénover surmontée d'une verrière",
  42: "Façade avec volet roulant et enduit en bas de mur",
  43: "Véranda au sol en carrelage imitation pierre",
  44: "Chantier de véranda dans un jardin ombragé",
  47: "Véranda neuve aux grandes baies vitrées, sous les pins",
  48: "Pose de carrelage sur une terrasse devant la maison",
  49: "Petit local en cours de ravalement, avec une échelle",
  50: "Mur en cours d'enduit avec échafaudage",
  51: "Extension vitrée habillée de pierre, avec baies coulissantes",
  52: "Extension à baies coulissantes et terrasse en préparation",
  53: "Petit bâtiment enduit avec porte en bois, véranda à côté",
  54: "Toiture en tuiles canal avec gouttière neuve",
  55: "Marches en blocs de béton en cours de réalisation",
  56: "Mur de local enduit couleur ocre",
  57: "Coffrage en bois d'une terrasse devant une baie vitrée",
  58: "Extension vitrée et porte en bois sous les pins",
  59: "Façade enduite protégée par du ruban avant peinture",
  60: "Maison aux volets bleus et terrasse en cours de carrelage",
  61: "Façade moderne vue d'en bas, avec sa verrière",
  62: "Artisan sur le chantier d'une véranda à baie coulissante noire",
  63: "Mur d'angle ocre sur un petit local",
  64: "Auvent blanc sur une façade rénovée",
  65: "Véranda et local aux portes en bois, terrain nivelé",
  66: "Façade enduite protégée avant peinture, fenêtres à persiennes blanches",
  67: "Véranda à baies marron et parement de pierre",
  68: "Façade avec volet roulant et enduit à deux teintes",
  70: "Parement en pierre sous une grande baie vitrée",
  71: "Mur d'un local enduit, à la lumière du soir",
  72: "Petit local enduit avec porte en bois",
  73: "Extension à baie vitrée avec terrasse en cours de coffrage",
  74: "Parement de pierre encadré par un enduit blanc",
  75: "Mini-pelle en action sur un chantier de terrassement",
  76: "Mur en pierre et enduit avec échafaudage en bois",
  77: "Artisan posant une plaque de plâtre dans une véranda",
  78: "Artisan sur un escabeau pendant l'ouverture d'un mur dans un séjour",
};

/**
 * Photos de chaque album, la première servant de couverture. Tri PROVISOIRE fait à la main : une
 * photo peut figurer dans plusieurs albums. Électricité, plomberie, peinture et climatisation n'ont
 * pas (assez) de photos : leurs albums n'apparaissent pas tant qu'il n'y en a pas au moins
 * `MIN_PHOTOS`.
 */
const ALBUM_PHOTOS: Readonly<Record<string, readonly number[]>> = {
  "renovation-complete": [
    51, 4, 5, 12, 15, 17, 18, 19, 30, 39, 43, 44, 47, 52, 53, 58, 62, 65, 67, 73, 78,
  ],
  "gros-oeuvre": [37, 9, 6, 7, 8, 10, 21, 23, 24, 26, 27, 28, 35, 36, 55, 56, 57, 63, 71, 72, 76],
  climatisation: [16],
  terrassement: [75, 38],
  facade: [70, 11, 20, 40, 41, 42, 49, 50, 59, 60, 61, 64, 66, 68, 74],
  couverture: [1, 2, 3, 31, 32, 33, 34, 54],
  electricite: [],
  plomberie: [],
  placo: [77, 25, 16],
  carrelage: [15, 4, 5, 12, 17, 18, 43, 48, 60],
  peinture: [39],
};

const sizes = dimensions as Readonly<Record<string, { width: number; height: number }>>;

function toPhoto(number: number): Photo | undefined {
  const size = sizes[String(number)];
  const alt = ALT[number];
  if (!size || !alt) return undefined;
  return { number, src: `/v2/realisations/photo-${number}.webp`, alt, ...size };
}

/** Une photo du dossier par son numéro (pour illustrer un article, par exemple). */
export function getPhoto(number: number): Photo | undefined {
  return toPhoto(number);
}

const configIntro = (slug: string) =>
  siteConfig.services.find((service) => service.slug === slug)?.intro;

function introFor(slug: string, title: string, description?: string): string {
  const base = description ?? configIntro(slug);
  // Pas de ville ici : on ne sait pas où chaque photo a été prise.
  const label = `Quelques-uns de nos chantiers de ${title.toLowerCase()}.`;
  return base ? `${base} ${label}` : label;
}

/** Tous les albums qui ont assez de photos, dans l'ordre des expertises. */
export const ALBUMS: readonly Album[] = EXPERTISES.flatMap(({ slug, title, description }) => {
  const photos = (ALBUM_PHOTOS[slug] ?? []).flatMap((number) => toPhoto(number) ?? []);
  if (photos.length < MIN_PHOTOS) return [];
  return [{ slug, title, intro: introFor(slug, title, description), photos }];
});

export function getAlbum(slug: string): Album | undefined {
  return ALBUMS.find((album) => album.slug === slug);
}

/** Vrai si le métier a un album à montrer (son badge devient alors un lien). */
export function hasAlbum(slug: string): boolean {
  return getAlbum(slug) !== undefined;
}
