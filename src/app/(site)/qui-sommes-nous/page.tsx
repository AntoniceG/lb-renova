import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/sections/home/final-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { aboutContent } from "@/content/about";
import { showDemo } from "@/content/demo";

const { brand, story, area } = siteConfig;

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description: `${brand.name} : une histoire de famille depuis ${story.since}, du tailleur de pierre venu d'Italie aux maçons d'aujourd'hui. Rénovation à ${area.baseCity}.`,
  alternates: { canonical: "/qui-sommes-nous" },
};

export default function AboutPage() {
  const { team, today } = aboutContent;
  return (
    <>
      <section className="overflow-hidden bg-navy-deep [background-image:radial-gradient(50rem_30rem_at_90%_-10%,color-mix(in_oklab,var(--blue)_55%,transparent),transparent),radial-gradient(30rem_24rem_at_-5%_110%,color-mix(in_oklab,var(--red)_26%,transparent),transparent)] text-white">
        <div className="relative container-page py-16 md:py-24">
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-1.5 text-sm text-white/70"
          >
            <Link href="/" className="hover:text-white">
              Accueil
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
            <span aria-current="page" className="text-white">
              Qui sommes-nous
            </span>
          </nav>
          <p
            aria-hidden
            className="mt-10 font-display text-[clamp(5rem,20vw,12rem)] leading-none font-extrabold tracking-tighter text-white/12 select-none"
          >
            {story.since}
          </p>
          <p className="-mt-2 eyebrow text-white/70">Depuis {story.since}</p>
          <h1 className="mt-4 max-w-3xl text-display">{story.title}</h1>
        </div>
      </section>

      <section aria-label="Notre histoire" className="py-20 md:py-28">
        <div className="container-page max-w-3xl space-y-6">
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-xl leading-relaxed text-ink/90">
              {paragraph}
            </p>
          ))}
          {showDemo && (
            <p className="rounded-card border border-dashed border-red/40 bg-white p-4 text-sm font-semibold text-red-ink">
              Aperçu : le récit complet sera ajouté ici (texte à fournir par le client).
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="aujourdhui" className="bg-surface py-20 md:py-28">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading id="aujourdhui" eyebrow="Aujourd'hui" title={today.title} />
          </div>
          <div className="space-y-5 md:col-span-7">
            {today.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-lg leading-relaxed text-ink/90">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section aria-labelledby="equipe" className="py-20 md:py-28">
          <div className="container-page">
            <SectionHeading
              id="equipe"
              eyebrow="L'équipe"
              title="Ceux qui interviennent chez vous"
            />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.name} className="rounded-card border border-line bg-white p-6">
                  <p className="font-display text-xl font-bold text-navy">{member.name}</p>
                  <p className="mt-1 text-sm font-semibold text-red-ink">{member.role}</p>
                  {member.bio && <p className="mt-3 leading-relaxed text-muted">{member.bio}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCta title="Parlons de votre projet" />
    </>
  );
}
