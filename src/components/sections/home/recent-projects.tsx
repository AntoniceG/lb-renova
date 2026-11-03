"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DemoProject } from "@/content/demo";
import { cn } from "@/lib/utils";

interface RecentProjectsProps {
  services: { slug: string; title: string }[];
  projects: DemoProject[];
  /** Contenu de démonstration : affiche un badge « Démo » sur chaque carte. */
  demo?: boolean;
}

const ALL = "all";

/** Réalisations récentes filtrables par métier. Alimenté par la base à partir de la phase 6. */
export function RecentProjects({ services, projects, demo = false }: RecentProjectsProps) {
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? projects : projects.filter((p) => p.serviceSlug === filter);
  const titleBySlug = new Map(services.map((s) => [s.slug, s.title]));

  return (
    <section aria-labelledby="realisations" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="realisations" eyebrow="Réalisations" title="Nos chantiers récents" />

        <div role="group" aria-label="Filtrer par spécialité" className="mt-8 flex flex-wrap gap-2">
          {[{ slug: ALL, title: "Tous" }, ...services].map(({ slug, title }) => (
            <button
              key={slug}
              type="button"
              aria-pressed={filter === slug}
              onClick={() => setFilter(slug)}
              className={cn(
                "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                filter === slug
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink hover:border-navy/40",
              )}
            >
              {title}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li
              key={project.id}
              className="overflow-hidden rounded-card border border-line bg-white"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,var(--sky),oklch(0.88_0.04_258))]">
                <ImageIcon aria-hidden className="size-10 text-navy/30" />
                {demo && (
                  <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-red-ink">
                    Démo
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold tracking-[0.14em] text-muted uppercase">
                  {titleBySlug.get(project.serviceSlug)}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-navy">{project.title}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
