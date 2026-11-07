import { TricolorRule } from "@/components/brand/tricolor-rule";
import { V2_HOME } from "@/lib/v2/content";

/** Texte d'intro entre le hero et « Nos expertises » : une phrase forte, un paragraphe. */
export function HomeIntro() {
  const { eyebrow, titleLead, titleEmphasis, lead, area } = V2_HOME.intro;

  return (
    <section
      aria-labelledby="intro-title"
      className="v2-relief bg-(--cream) pt-16 pb-24 md:pt-24 md:pb-32"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            {eyebrow}
          </p>

          <h2
            id="intro-title"
            className="reveal mt-6 font-v2-display text-4xl leading-[1.1] text-navy md:text-6xl"
          >
            {titleLead} <em className="text-blue">{titleEmphasis}</em>
          </h2>

          <p className="reveal mt-8 text-lg leading-relaxed text-pretty text-ink/80 md:text-xl">
            {lead}
          </p>

          <TricolorRule className="reveal mx-auto mt-10 h-0.5 w-24" />
          <p className="reveal mt-5 text-sm tracking-wide text-muted">{area}</p>
        </div>
      </div>
    </section>
  );
}
