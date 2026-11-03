import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";

export function SiteFooter() {
  const { brand, contact, area, services } = siteConfig;
  const { address } = contact;

  return (
    <footer id="site-footer" className="bg-navy-deep text-white">
      <TricolorRule />
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo name={brand.name} tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">{brand.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm font-bold tracking-[0.14em] text-white uppercase">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Phone aria-hidden className="size-4 text-white/60" />
              <a href={telHref(contact.phone.e164)} className="hover:text-white">
                {contact.phone.display}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden className="size-4 text-white/60" />
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-white/60" />
              <span>
                {address.street}
                <br />
                {address.postalCode} {address.city}
              </span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-bold tracking-[0.14em] text-white uppercase">Spécialités</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {services.map(({ slug, title }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="inline-flex min-h-8 items-center hover:text-white"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm font-bold tracking-[0.14em] text-white uppercase">Zone</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            {area.baseCity} et dans un rayon de {area.radiusKm} km.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/70">
            {area.priorityCities.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.legalName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
