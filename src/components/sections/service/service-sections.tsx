import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BeforeAfter } from "@/components/sections/home/before-after";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import type { ServiceConfig } from "@/config/site.schema";
import { demoBeforeAfter } from "@/content/demo";
import type { GuideSection, TitledText } from "@/content/services";
import { telHref } from "@/lib/brand";

export function ServiceHero({ service, lead }: { service: ServiceConfig; lead: string }) {
  const { nav, contact } = siteConfig;
  const Icon = ICONS[service.iconKey];
  return (
    <section className="bg-navy-deep [background-image:radial-gradient(50rem_30rem_at_90%_-10%,color-mix(in_oklab,var(--blue)_55%,transparent),transparent),radial-gradient(30rem_24rem_at_-5%_110%,color-mix(in_oklab,var(--red)_26%,transparent),transparent)] text-white">
      <div className="container-page py-16 md:py-24">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-white/70">
          <Link href="/" className="hover:text-white">
            Accueil
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <span aria-current="page" className="text-white">
            {service.title}
          </span>
        </nav>
        <span className="mt-8 inline-flex size-14 items-center justify-center rounded-2xl bg-white/10">
          <Icon aria-hidden className="size-7" />
        </span>
        <h1 className="mt-5 max-w-3xl text-display">
          {service.title}{" "}
          <span className="block font-light text-white/85 italic">
            à {siteConfig.area.baseCity}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{lead}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="xl" asChild>
            <Link href={nav.quoteHref}>Recevoir mon devis gratuit</Link>
          </Button>
          <Button variant="ghostLight" size="xl" asChild>
            <a href={telHref(contact.phone.e164)}>
              {nav.callLabel} {contact.phone.display}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ServiceBenefits({ benefits }: { benefits: TitledText[] }) {
  return (
    <section aria-label="Nos atouts" className="py-16 md:py-20">
      <ul className="container-page grid gap-5 md:grid-cols-3">
        {benefits.map((benefit, i) => (
          <li
            key={benefit.title}
            className="reveal rounded-card border border-line bg-white p-6"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-red font-display text-lg font-extrabold text-white">
              {i + 1}
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-navy">{benefit.title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{benefit.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServiceSolutions({ title, solutions }: { title: string; solutions: TitledText[] }) {
  return (
    <section aria-labelledby="prestations" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="prestations" eyebrow="Prestations" title={title} />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {solutions.map((solution, i) => (
            <li
              key={solution.title}
              className="reveal rounded-card border border-line bg-white p-7"
              style={{ "--i": i % 2 } as CSSProperties}
            >
              <h3 className="font-display text-2xl font-bold text-navy">{solution.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{solution.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceGuides({ guides }: { guides: GuideSection[] }) {
  return (
    <section aria-label="Bien comprendre votre projet" className="py-20 md:py-28">
      <div className="container-page space-y-20">
        {guides.map((guide, i) => (
          <article key={guide.title} className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <p className="eyebrow">À savoir</p>
              <h2 className="mt-4 text-title text-navy md:sticky md:top-28">{guide.title}</h2>
            </div>
            <div className="space-y-5 md:col-span-8">
              {guide.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-lg leading-relaxed text-ink/90">
                  {paragraph}
                </p>
              ))}
              {guide.points && (
                <ul
                  aria-label={`Points clés : ${guide.title}`}
                  className="grid gap-3 rounded-card bg-sky p-6"
                >
                  {guide.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 font-semibold text-navy">
                      <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-red-ink" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {i < guides.length - 1 && <hr className="border-line md:col-span-12" />}
          </article>
        ))}
      </div>
    </section>
  );
}

/** Cas concret : gabarit avant/après en démonstration (visible hors production uniquement). */
export function ServiceCase({ title }: { title: string }) {
  return (
    <section aria-labelledby="cas-concret" className="bg-surface py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="cas-concret" eyebrow="Cas concret" title={`${title} : avant / après`}>
            Un chantier réel présenté avec son état initial, son résultat et la nature des travaux.
          </SectionHeading>
        </div>
        <div className="lg:col-span-7">
          <BeforeAfter pair={demoBeforeAfter} demo />
        </div>
      </div>
    </section>
  );
}

export function OtherServices({ currentSlug }: { currentSlug: string }) {
  const others = siteConfig.services.filter((s) => s.slug !== currentSlug);
  return (
    <section aria-labelledby="autres-specialites" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="autres-specialites"
          eyebrow="Nos autres spécialités"
          title="Un seul interlocuteur pour tout votre projet"
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {others.map((service) => {
            const Icon = ICONS[service.iconKey];
            return (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="group flex h-full items-center gap-5 rounded-card border border-line bg-white p-6 transition-shadow hover:shadow-elevated"
                >
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-navy">
                    <Icon aria-hidden className="size-7" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-bold text-navy">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-muted">{service.intro}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="ml-auto size-5 shrink-0 text-navy transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
