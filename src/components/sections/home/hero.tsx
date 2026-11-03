import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { heroSlides } from "@/content/home";
import { telHref } from "@/lib/brand";
import { HeroBackground, HeroControls, HeroKeyword, HeroLabel, HeroStage } from "./hero-slideshow";
import { QuickQuote } from "./quick-quote";
import { getReassuranceItems } from "./reassurance";

export function Hero() {
  const { brand, area, contact, nav, services } = siteConfig;
  const projectTypes = [
    { value: "renovation-globale", label: "Rénovation globale" },
    ...services.map((s) => ({ value: s.slug, label: s.title })),
    { value: "autre", label: "Autre projet" },
  ];

  return (
    <HeroStage
      slides={heroSlides}
      className="bg-navy-deep [background-image:radial-gradient(60rem_40rem_at_85%_-10%,color-mix(in_oklab,var(--blue)_55%,transparent),transparent),radial-gradient(40rem_30rem_at_-5%_110%,color-mix(in_oklab,var(--red)_28%,transparent),transparent)] text-white"
    >
      <HeroBackground />

      <div className="container-page grid min-h-[40rem] items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20">
        <div className="md:col-span-7">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.16em] uppercase backdrop-blur">
            {brand.tagline}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2rem,1.1rem+3.8vw,4rem)] leading-[1.04] font-extrabold tracking-tight">
            Rénovation complète de votre maison, du gros œuvre aux finitions{" "}
            <span className="block font-light text-white/85 italic">à {area.baseCity}</span>
          </h1>

          <p className="mt-6 text-xl text-white/90 md:text-2xl">
            Un spécialiste dédié à votre{" "}
            <strong className="font-display font-bold text-white">
              <HeroKeyword />
            </strong>
          </p>

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

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-semibold text-white/90 md:hidden">
            {getReassuranceItems().map(({ key, label, icon: Icon }) => (
              <li key={key} className="flex items-center gap-2">
                <Icon aria-hidden className="size-4.5 text-white/70" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <QuickQuote projectTypes={projectTypes} quoteHref={nav.quoteHref} />
        </div>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-3 pb-6">
        <HeroLabel />
        <HeroControls className="ml-auto" />
      </div>
    </HeroStage>
  );
}
