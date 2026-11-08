import type { Metadata } from "next";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { ZONE } from "@/lib/v2/zone";

const { brand, contact } = siteConfig;

/** Image de partage (1200 x 630), fabriquée par design-v2/preparer-les-icones.mjs. */
export const SHARE_IMAGE = {
  url: "/partage.jpg",
  width: 1200,
  height: 630,
  alt: `${brand.name} : rénovation à Marseille et Aix-en-Provence`,
};

/** Adresse complète d'une page (`/devis` → `https://…/devis`). */
export const absoluteUrl = (path: string) => `${env.siteUrl}${path === "/" ? "" : path}`;

interface PageMetadataInput {
  /** Titre court : la marque est ajoutée derrière (« Devis gratuit | LB Rénova »). */
  title: string;
  /** Écrit le titre tel quel, sans la marque derrière. */
  absoluteTitle?: boolean;
  /** 155 caractères au plus. */
  description: string;
  /** Adresse de la page, depuis la racine : `/devis`. */
  path: string;
  type?: "website" | "article";
  /** Articles : date de publication AAAA-MM-JJ. */
  publishedTime?: string;
  /** Page à ne pas montrer dans Google (remerciement, banc d'essai). */
  noindex?: boolean;
}

/**
 * Métadonnées d'une page : titre, description, adresse canonique (celle que Google doit retenir,
 * même si la page est atteinte avec des paramètres de campagne) et carte de partage
 * (image : `public/partage.jpg`).
 */
export function pageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${brand.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: brand.name,
      locale: "fr_FR",
      type,
      images: [SHARE_IMAGE],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SHARE_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Image mise en avant quand une page n'a pas la sienne. */
const DEFAULT_IMAGE = "/v2/port-large.webp";

const businessId = () => `${env.siteUrl}/#entreprise`;

/** Renvoi léger vers l'entreprise, pour les pages qui n'en décrivent pas toute la fiche. */
const businessRef = () => ({
  "@type": "GeneralContractor",
  "@id": businessId(),
  name: brand.name,
  url: env.siteUrl,
});

const areaServed = () =>
  [...ZONE.principales, ...ZONE.autres].map((name) => ({ "@type": "City", name }));

/**
 * Fiche de l'entreprise pour Google (page d'accueil). Seules les informations réellement connues
 * y figurent : une constante `TODO_` est simplement omise. Volontairement ABSENTS : note et avis
 * clients (aucun avis réel pour l'instant) et date de création (« 1945 » est l'origine du savoir-faire
 * familial, pas la date de fondation de l'entreprise).
 */
export function businessJsonLd() {
  const { address } = contact;
  const hasAddress = ![address.street, address.postalCode, address.city].some(isTodo);
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": businessId(),
    name: brand.name,
    ...(isTodo(brand.legalName) ? {} : { legalName: brand.legalName }),
    url: env.siteUrl,
    logo: absoluteUrl("/v2/logo-v2-clair.webp"),
    image: absoluteUrl(DEFAULT_IMAGE),
    description: brand.description,
    slogan: brand.tagline,
    ...(isTodo(contact.phone.e164) ? {} : { telephone: contact.phone.e164 }),
    ...(isTodo(contact.email) ? {} : { email: contact.email }),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            postalCode: address.postalCode,
            addressLocality: address.city,
            addressCountry: "FR",
          },
        }
      : {}),
    areaServed: areaServed(),
    ...(contact.googleBusinessUrl && !isTodo(contact.googleBusinessUrl)
      ? { sameAs: [contact.googleBusinessUrl] }
      : {}),
  };
}

/** Fil d'Ariane : montre à Google où se situe la page dans le site. */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Une prestation (page métier). */
export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl(path),
    provider: businessRef(),
    areaServed: areaServed(),
  };
}

/** Un article de conseils. */
export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  image,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    inLanguage: "fr-FR",
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(image ?? DEFAULT_IMAGE),
    author: { "@type": "Organization", name: brand.name, url: env.siteUrl },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      url: env.siteUrl,
      logo: { "@type": "ImageObject", url: absoluteUrl("/v2/logo-v2-clair.webp") },
    },
  };
}
