import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { telHref } from "@/lib/brand";
import { V2_NAV, V2_QUOTE_HREF } from "@/lib/v2/nav";
import { PILIERS } from "@/lib/v2/piliers";
import { ZONE } from "@/lib/v2/zone";
import { V2HomeLink } from "./home-link";

/**
 * Pied de page de la refonte. N'affiche que les coordonnées réellement renseignées : tant que
 * l'e-mail ou l'adresse sont encore des `TODO_` dans la config, ils sont simplement masqués.
 */
export function V2Footer() {
  const { brand, contact, nav } = siteConfig;
  const { address } = contact;
  const hasEmail = !isTodo(contact.email);
  const hasAddress =
    address !== undefined &&
    !isTodo(address.street) &&
    !isTodo(address.postalCode) &&
    !isTodo(address.city);
  const villes = [...ZONE.principales, ...ZONE.autres];

  return (
    <footer className="bg-navy-deep text-white">
      <TricolorRule />
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <V2HomeLink aria-label={`${brand.name} — accueil`} className="inline-block">
            <Image
              src="/v2/logo-20ans.webp"
              alt=""
              width={887}
              height={887}
              sizes="120px"
              className="size-28"
            />
          </V2HomeLink>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{brand.tagline}</p>
        </div>

        <nav aria-label="Pied de page">
          <h2 className="font-v2-sans text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Menu
          </h2>
          <ul className="mt-5 space-y-1 text-base">
            {V2_NAV.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-9 items-center hover:text-white/75">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={V2_QUOTE_HREF}
                className="inline-flex min-h-9 items-center hover:text-white/75"
              >
                {nav.quoteLabel}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Nos métiers">
          <h2 className="font-v2-sans text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Nos métiers
          </h2>
          <ul className="mt-5 space-y-1 text-base">
            {PILIERS.map(({ slug, title }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="inline-flex min-h-9 items-center hover:text-white/75"
                >
                  {title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/realisations"
                className="inline-flex min-h-9 items-center hover:text-white/75"
              >
                Toutes nos réalisations
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-v2-sans text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Contact
          </h2>
          <ul className="mt-5 space-y-3 text-base">
            <li className="flex items-center gap-3">
              <Phone aria-hidden className="size-4 text-white/60" />
              <a href={telHref(contact.phone.e164)} className="hover:text-white/75">
                {contact.phone.display}
              </a>
            </li>
            {hasEmail && (
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="size-4 text-white/60" />
                <a href={`mailto:${contact.email}`} className="hover:text-white/75">
                  {contact.email}
                </a>
              </li>
            )}
            {hasAddress && address && (
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-white/60" />
                <span>
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-v2-sans text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Secteur
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80">
            {villes.join(", ")} et alentours.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. Tous droits réservés.
          </p>
          <Link
            href="/mentions-legales"
            className="inline-flex min-h-9 items-center hover:text-white/80"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
