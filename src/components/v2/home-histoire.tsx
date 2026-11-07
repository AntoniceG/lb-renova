import type { ReactNode } from "react";
import { HISTOIRE, type HistoireBand, type HistoireKey } from "@/lib/v2/histoire";
import { AujourdhuiVisual, MarseilleVisual, OriginesVisual } from "./histoire-visuals";

const VISUALS: Record<HistoireKey, () => ReactNode> = {
  origines: () => <OriginesVisual />,
  marseille: () => <MarseilleVisual />,
  aujourdhui: () => <AujourdhuiVisual />,
};

/** Seule la dernière bande a une photo qui remplit tout l'espace ; les autres sont centrées. */
const FULL_BLEED: ReadonlySet<HistoireKey> = new Set(["aujourdhui"]);

function Band({ band }: { band: HistoireBand }) {
  const fullBleed = FULL_BLEED.has(band.key);
  return (
    <article className="histoire-band" data-side={band.side}>
      <div className="histoire-slab histoire-slab--image">
        <div className={fullBleed ? "histoire-visual histoire-visual--full" : "histoire-visual"}>
          {VISUALS[band.key]()}
        </div>
      </div>

      <div className="histoire-slab histoire-slab--text">
        <div className="histoire-copy">
          <p className="text-xs font-semibold tracking-[0.28em] text-white/60 uppercase">
            {band.eyebrow}
          </p>
          <h3 className="mt-3 font-v2-display text-3xl leading-[1.15] text-white md:text-4xl lg:text-[1.9rem] xl:text-4xl">
            {band.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-white/80 md:text-[1.05rem] lg:text-[0.95rem] xl:text-base">
            {band.body}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * L'histoire de la famille, façon musée : trois bandes peu hautes, qui alternent
 * image et texte. Chaque bande est coupée en biais ; au défilement, l'image et le texte arrivent
 * chacun de leur côté et se rejoignent sur la coupe (voir `.histoire-*` dans v2.css).
 */
export function HomeHistoire() {
  return (
    <section id="histoire" aria-labelledby="histoire-title" className="bg-(--cream) pt-20 md:pt-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl pb-12 text-center md:pb-16">
          <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            {HISTOIRE.eyebrow}
          </p>
          <h2
            id="histoire-title"
            className="reveal mt-5 font-v2-display text-4xl leading-[1.1] text-navy md:text-6xl"
          >
            {HISTOIRE.title}
          </h2>
        </div>
      </div>

      {/* Bandes pleine largeur, de bord à bord de la page, mais peu hautes. */}
      <div className="flex flex-col">
        {HISTOIRE.bands.map((band) => (
          <Band key={band.key} band={band} />
        ))}
      </div>
    </section>
  );
}
