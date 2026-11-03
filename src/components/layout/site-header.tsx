import { Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { MobileNav } from "./mobile-nav";
import { ServicesMenu } from "./services-menu";

export function SiteHeader() {
  const { brand, contact, nav, services } = siteConfig;
  const menuServices = services.map(({ slug, title, iconKey }) => ({ slug, title, iconKey }));
  const phoneHref = telHref(contact.phone.e164);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <TricolorRule />
      <div className="relative container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo name={brand.name} />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          <ServicesMenu label={nav.servicesLabel} services={menuServices} />
          {nav.links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink/85 transition-colors hover:text-navy"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy hover:text-red-ink"
          >
            <Phone aria-hidden className="size-4" />
            {contact.phone.display}
          </a>
          <Button variant="cta" asChild>
            <Link href={nav.quoteHref}>{nav.quoteLabel}</Link>
          </Button>
        </div>

        <MobileNav
          servicesLabel={nav.servicesLabel}
          services={menuServices}
          links={nav.links}
          quote={{ label: nav.quoteLabel, href: nav.quoteHref }}
          phone={{ label: contact.phone.display, href: phoneHref }}
        />
      </div>
    </header>
  );
}
