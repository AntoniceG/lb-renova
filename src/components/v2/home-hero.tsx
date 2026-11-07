import { Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { V2_HOME } from "@/lib/v2/content";
import { HERO_LOOK } from "@/lib/v2/hero-look";
import { DEFAULT_WATER_PARAMS } from "@/lib/v2/water";
import { v2Button } from "./button-styles";
import { HeroLogo } from "./hero-logo";
import { WaterCanvas } from "./water-canvas";
import { WaterVeil } from "./water-veil";

/**
 * Hero : la photo du port avec son eau vivante, le logo, deux boutons, un titre discret.
 * Pas de `isolate`, de z-index ni de transform ici : le logo volant doit pouvoir passer
 * au-dessus de l'en-tête (voir hero-logo.tsx).
 */
export function HomeHero() {
  const { brand, contact, nav } = siteConfig;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-navy-deep px-5 pt-8 pb-24 text-white md:pb-28"
    >
      <WaterCanvas params={DEFAULT_WATER_PARAMS} />
      <WaterVeil veil={HERO_LOOK.veil} warmth={HERO_LOOK.warmth} />

      <div className="relative flex flex-col items-center gap-6 text-center">
        <HeroLogo name={brand.name} />

        <h1
          id="hero-title"
          className="max-w-[24ch] font-v2-display text-[1.5rem] leading-snug text-balance text-white/95 italic [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:max-w-[40ch] sm:text-[1.9rem] lg:text-[2.2rem]"
        >
          {V2_HOME.h1}
        </h1>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href={nav.quoteHref} className={v2Button({ tone: "light" })}>
            {nav.quoteLabel}
          </Link>
          <a href={telHref(contact.phone.e164)} className={v2Button({ tone: "glass" })}>
            <Phone aria-hidden className="size-4" />
            {nav.callLabel}
          </a>
        </div>
      </div>

      {/* Invitation à défiler : c'est le défilement qui attrape le logo. */}
      <div aria-hidden className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 md:block">
        <span className="v2-scroll-cue block h-10 w-px bg-linear-to-b from-white/0 to-white/80" />
      </div>

      {/* Vague de séparation : l'eau se prolonge jusqu'au texte d'intro. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-10 w-full fill-(--cream) md:h-16"
      >
        <path d="M0 46C160 86 320 6 520 34s380 56 560 18 270-26 360-4v46H0Z" />
      </svg>
      {/* Liseré crème : évite un fin trait sombre à la jonction avec le texte, selon l'arrondi du défilement. */}
      <div aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 bg-(--cream)" />
    </section>
  );
}
