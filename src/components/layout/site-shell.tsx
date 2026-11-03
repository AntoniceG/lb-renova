import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { StickyCta } from "./sticky-cta";

export function SiteShell({ children }: { children: ReactNode }) {
  const { nav, contact } = siteConfig;
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main id="contenu">{children}</main>
      <SiteFooter />
      <StickyCta
        quote={{ label: nav.quoteLabel, href: nav.quoteHref }}
        call={{ label: nav.callLabel, href: telHref(contact.phone.e164) }}
      />
    </>
  );
}
