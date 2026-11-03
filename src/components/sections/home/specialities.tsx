import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ICONS } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

/** Bento des spécialités : la première carte (gros œuvre, cœur de métier de la famille) est la carte héros. */
export function Specialities() {
  const { services } = siteConfig;
  return (
    <section aria-labelledby="specialites" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="specialites"
          eyebrow="Nos spécialités"
          title="Un spécialiste pour chaque corps de métier"
        >
          Du gros œuvre à la toiture, en passant par la climatisation : un seul interlocuteur pour
          votre projet, un expert pour chaque étape.
        </SectionHeading>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 md:grid-rows-2">
          {services.map((service, i) => {
            const Icon = ICONS[service.iconKey];
            const hero = i === 0;
            return (
              <li
                key={service.slug}
                className={cn("reveal", hero && "md:row-span-2")}
                style={{ "--i": i } as CSSProperties}
              >
                <Link
                  href={`/${service.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-hero border p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-elevated md:p-9",
                    hero
                      ? "min-h-80 border-navy bg-navy text-white"
                      : "border-line bg-white text-ink",
                  )}
                >
                  <Icon
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-6 -bottom-6 size-48 rotate-12 stroke-[1.25] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                      hero ? "text-white/10" : "text-navy/5",
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex size-12 items-center justify-center rounded-2xl",
                      hero ? "bg-white/12 text-white" : "bg-sky text-navy",
                    )}
                  >
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3
                    className={cn(
                      "relative mt-5 font-display font-bold",
                      hero ? "text-3xl md:text-4xl" : "text-2xl",
                    )}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={cn(
                      "relative mt-3 max-w-md leading-relaxed",
                      hero ? "text-lg text-white/80" : "text-muted",
                    )}
                  >
                    {service.intro}
                  </p>
                  <ul className="relative mt-5 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check
                          aria-hidden
                          className={cn("size-4 shrink-0", hero ? "text-white/70" : "text-red-ink")}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span
                    className={cn(
                      "relative mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold",
                      hero ? "text-white" : "text-navy",
                    )}
                  >
                    Découvrir {service.title.toLowerCase()}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
