import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

/** Zone d'intervention. Les villes deviendront des liens vers /zones/[city] en phase 7. */
export function ServiceArea() {
  const { area } = siteConfig;
  return (
    <section aria-labelledby="zone" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <SectionHeading
            id="zone"
            eyebrow="Zone d'intervention"
            title={`${area.baseCity} et ses alentours`}
          >
            Nous intervenons à {area.baseCity} et dans un rayon de {area.radiusKm} km.
          </SectionHeading>
          <ul className="mt-8 flex flex-wrap gap-2">
            {area.priorityCities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>

        {/* Repère visuel du rayon d'action ; volontairement sans positions de villes (pas une vraie carte). */}
        <div aria-hidden className="relative mx-auto aspect-square w-full max-w-sm md:col-span-6">
          {[100, 70, 40].map((size, i) => (
            <span
              key={size}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/20"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                background: `color-mix(in oklab, var(--sky) ${30 + i * 25}%, transparent)`,
              }}
            />
          ))}
          <span className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red ring-8 ring-red/20" />
          <span className="absolute top-[7%] left-1/2 -translate-x-1/2 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
            {area.radiusKm} km
          </span>
        </div>
      </div>
    </section>
  );
}
