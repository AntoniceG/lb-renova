import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { V2_NAV, V2_QUOTE_HREF } from "@/lib/v2/nav";
import { v2Button } from "./button-styles";
import { V2MobileMenu } from "./v2-mobile-menu";

interface V2HeaderProps {
  /**
   * `home` : page d'accueil, l'en-tête apparaît quand le logo s'envole du hero.
   * `page` : pages intérieures, l'en-tête est toujours là, avec le logo à sa place.
   */
  variant?: "home" | "page";
}

/**
 * En-tête de la refonte : une barre BLANCHE, invisible tant que le logo est dans le hero. Elle
 * apparaît pendant que le logo s'envole vers l'emplacement `data-logo-slot="header"` (voir
 * hero-logo.tsx et v2.css) ; le logo y arrive en version à texte marine.
 * Le logo lui-même n'est PAS ici : l'emplacement est vide, c'est le logo volant qui vient s'y poser.
 * Le menu des petits écrans est hors de l'en-tête : son bouton doit rester visible en haut de page.
 */
export function V2Header({ variant = "home" }: V2HeaderProps) {
  const { brand, contact, nav } = siteConfig;
  const phoneHref = telHref(contact.phone.e164);
  const solid = variant === "page";

  return (
    <>
      <header
        className={cn(
          "v2-header fixed inset-x-0 top-0 z-50 text-navy",
          solid && "v2-header--solid",
        )}
      >
        <div
          aria-hidden
          className="v2-header__bar absolute inset-0 border-b border-navy/10 bg-white/95 shadow-[0_10px_30px_-14px_rgba(10,20,60,0.3)] backdrop-blur-xl"
        >
          <TricolorRule />
        </div>

        <div className="v2-header__content relative container-page flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          {solid ? (
            <Link
              href="/v2"
              aria-label={`${brand.name} — accueil`}
              className="block size-14 shrink-0 md:size-16"
            >
              <Image
                src="/v2/logo-v2-clair.webp"
                alt=""
                width={887}
                height={887}
                sizes="64px"
                loading="eager"
                className="size-full"
              />
            </Link>
          ) : (
            <span
              aria-hidden
              data-logo-slot="header"
              className="block size-14 shrink-0 md:size-16"
            />
          )}

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-5 lg:flex xl:gap-10"
          >
            {V2_NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="v2-nav-link text-[0.74rem] font-semibold tracking-[0.18em] text-navy/80 uppercase transition-colors hover:text-navy focus-visible:outline-blue"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 max-lg:mr-12 sm:gap-4">
            <a
              href={phoneHref}
              aria-label={`Appeler le ${contact.phone.display}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full px-2 text-sm font-semibold tracking-wide transition-colors hover:text-navy/70 focus-visible:outline-blue sm:px-3"
            >
              <Phone aria-hidden className="size-4" />
              <span className="hidden sm:inline lg:hidden xl:inline">{contact.phone.display}</span>
            </a>
            <Link href={V2_QUOTE_HREF} className={v2Button({ tone: "navy", size: "compact" })}>
              {nav.quoteLabel}
            </Link>
          </div>
        </div>
      </header>

      <V2MobileMenu
        solid={solid}
        links={V2_NAV}
        quote={{ label: nav.quoteLabel, href: V2_QUOTE_HREF }}
        phone={{ label: contact.phone.display, href: phoneHref }}
      />
    </>
  );
}
