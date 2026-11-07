import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";
import { PORT_LANDSCAPE } from "@/lib/v2/sources";
import { v2Button } from "./button-styles";
import { WaterVeil } from "./water-veil";

/** Dernier appel au devis : le port du hero revient, sous un voile plus sombre, pour boucler la page. */
export function HomeCta() {
  const { contact, nav, promise } = siteConfig;

  return (
    <section
      id="devis"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-navy-deep py-24 text-center text-white md:py-32"
    >
      {/*
        La photo est posée EN BAS d'une boîte deux fois plus haute que la bande : on n'en voit que la
        moitié basse (bateaux, quais, reflets). Notre-Dame-de-la-Garde (30 à 46 % de la hauteur de
        la photo) est donc toujours hors cadre, quelle que soit la largeur de l'écran. Pour la
        faire réapparaître : mettre `object-[50%_75%]` à la place de `object-bottom`, et retirer la boîte.
      */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[max(56.25vw,72rem)]">
        <Image
          src={PORT_LANDSCAPE.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      <WaterVeil veil={0.74} warmth={0.6} />

      <div className="relative container-page">
        <h2
          id="cta-title"
          className="mx-auto max-w-3xl font-v2-display text-4xl leading-[1.1] text-balance md:text-6xl"
        >
          Parlons de votre <em>projet</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/85 md:text-xl">
          Décrivez-le en quelques étapes : le devis est gratuit et nous vous rappelons{" "}
          {promise.callbackDelay}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={V2_QUOTE_HREF} className={v2Button({ tone: "light" })}>
            {nav.quoteLabel}
          </Link>
          <a href={telHref(contact.phone.e164)} className={v2Button({ tone: "glass" })}>
            <Phone aria-hidden className="size-4" />
            {contact.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
