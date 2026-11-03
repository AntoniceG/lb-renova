import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

/** Teaser du storytelling familial ; le récit complet vit sur /qui-sommes-nous (phase 4). */
export function FamilyStory() {
  const { story } = siteConfig;
  return (
    <section aria-labelledby="histoire" className="overflow-hidden bg-sky py-20 md:py-28">
      <div className="container-page grid items-center gap-8 md:grid-cols-12">
        <p
          aria-hidden
          className="font-display text-[clamp(6rem,22vw,13rem)] leading-none font-extrabold tracking-tighter text-navy/12 select-none md:col-span-5"
        >
          {story.since}
        </p>
        <div className="reveal md:col-span-7">
          <p className="eyebrow">Depuis {story.since}</p>
          <h2 id="histoire" className="mt-4 text-title text-navy">
            {story.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85">{story.teaser}</p>
          <Link
            href="/qui-sommes-nous"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-navy"
          >
            Lire notre histoire
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
