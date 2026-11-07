import { Phone } from "lucide-react";
import Link from "next/link";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { v2Button } from "./button-styles";

/**
 * En-tête de la refonte. Invisible tant que le logo est dans le hero : il apparaît pendant que le
 * logo s'envole vers l'emplacement `data-logo-slot="header"` (voir hero-logo.tsx et v2.css).
 * Le logo lui-même n'est PAS ici : l'emplacement est vide, c'est le logo volant qui vient s'y poser.
 */
export function V2Header() {
  const { contact, nav } = siteConfig;

  return (
    <header className="v2-header fixed inset-x-0 top-0 z-50 text-white">
      <div
        aria-hidden
        className="v2-header__bar absolute inset-0 bg-navy-deep/90 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <TricolorRule />
      </div>

      <div className="v2-header__content relative container-page flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
        <span aria-hidden data-logo-slot="header" className="block size-14 shrink-0 md:size-16" />

        <div className="flex items-center gap-1 sm:gap-4">
          <a
            href={telHref(contact.phone.e164)}
            aria-label={`Appeler le ${contact.phone.display}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full px-2 text-sm font-semibold tracking-wide transition-colors hover:text-white/75 focus-visible:outline-white sm:px-3"
          >
            <Phone aria-hidden className="size-4" />
            <span className="hidden sm:inline">{contact.phone.display}</span>
          </a>
          <Link href={nav.quoteHref} className={v2Button({ tone: "light", size: "compact" })}>
            {nav.quoteLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
