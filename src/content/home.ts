import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";

export interface HeroImage {
  /** Chemin public (ex. `/images/hero/toiture.avif`), pré-optimisé en AVIF/WebP. */
  src: string;
  alt: string;
  /** Étiquette affichée sur le visuel, ex. « Couverture – Aix-en-Provence ». Photo réelle uniquement. */
  location?: string;
}

export interface HeroSlide {
  /** Mot rotatif de l'accroche, sous le H1. */
  keyword: string;
  serviceSlug: string;
  /** Photo réelle du chantier. Sans image, le hero reste sur son fond dégradé. */
  image?: HeroImage;
}

/** Pas de photo réelle pour l'instant : à renseigner quand elles seront livrées. */
export const heroSlides: HeroSlide[] = [
  { keyword: "gros œuvre", serviceSlug: "gros-oeuvre" },
  { keyword: "toiture", serviceSlug: "couverture" },
  { keyword: "climatisation", serviceSlug: "climatisation" },
  { keyword: "extension", serviceSlug: "gros-oeuvre" },
];

export const processSteps = [
  {
    title: "Visite et étude",
    text: "Nous venons chez vous écouter votre projet, observer l'existant et prendre les mesures.",
  },
  {
    title: "Devis détaillé",
    text: "Vous recevez un devis détaillé et gratuit, sans engagement, poste par poste.",
  },
  {
    title: "Travaux",
    text: "Chaque corps de métier est assuré par un spécialiste de l'entreprise.",
  },
  {
    title: "Réception",
    text: "Nous réceptionnons le chantier avec vous et vérifions ensemble chaque point.",
  },
] as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaq(): FaqItem[] {
  const { area, certifications, services, brand } = siteConfig;
  const items: FaqItem[] = [
    {
      question: "Le devis est-il gratuit ?",
      answer:
        "Oui. Après la visite, vous recevez un devis détaillé et gratuit, sans aucun engagement de votre part.",
    },
    {
      question: "Quels travaux réalisez-vous ?",
      answer: `${brand.name} intervient en rénovation sur trois spécialités : ${services
        .map((s) => s.title.toLowerCase())
        .join(", ")}. Vous pouvez aussi nous confier un projet qui en associe plusieurs.`,
    },
    {
      question: "Qui intervient sur mon chantier ?",
      answer:
        "Chaque corps de métier est porté par un spécialiste de l'entreprise : le maçon s'occupe du gros œuvre, un spécialiste de la couverture, un autre de la climatisation.",
    },
    {
      question: "Dans quelle zone intervenez-vous ?",
      answer: `Nous intervenons à ${area.baseCity} et dans un rayon de ${area.radiusKm} km autour.`,
    },
    {
      question: "Comment se déroule un projet ?",
      answer: `${processSteps.map((s, i) => `${i + 1}. ${s.title}`).join(" · ")}. Chaque étape est expliquée en détail ci-dessus.`,
    },
    {
      question: "Ai-je besoin d'une autorisation d'urbanisme ?",
      answer:
        "Cela dépend du projet et de la commune : certains travaux visibles de l'extérieur ou créant de la surface demandent une déclaration préalable ou un permis de construire. Nous en parlons lors de la visite.",
    },
  ];

  if (certifications.decennale.enabled) {
    items.splice(3, 0, {
      question: "Mes travaux sont-ils assurés ?",
      answer:
        "Les travaux de construction relèvent de la garantie décennale : elle couvre pendant dix ans après la réception les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination.",
    });
  }

  if (!isTodo(siteConfig.promise.callbackDelay)) {
    items.push({
      question: "Sous quel délai serai-je rappelé ?",
      answer: `Nous nous engageons à vous rappeler ${siteConfig.promise.callbackDelay}.`,
    });
  }

  return items;
}
