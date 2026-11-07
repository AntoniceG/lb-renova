import { Star } from "lucide-react";
import { env } from "@/config/env";
import { AVIS, type Avis } from "@/lib/v2/avis";
import { cn } from "@/lib/utils";

function Stars({ note }: { note: Avis["note"] }) {
  return (
    <p role="img" aria-label={`${note} sur 5`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          strokeWidth={1.5}
          className={cn("size-4", index < note ? "fill-current text-(--gold)" : "text-current/25")}
        />
      ))}
    </p>
  );
}

function Card({ avis, featured }: { avis: Avis; featured: boolean }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-8 p-7 md:p-9",
        featured ? "bg-navy text-white" : "border border-navy/12 bg-white text-ink",
      )}
    >
      <div>
        <Stars note={avis.note} />
        <blockquote
          className={cn(
            "mt-5",
            featured
              ? "font-v2-display text-2xl leading-snug italic md:text-[1.75rem]"
              : "text-base leading-relaxed text-ink/85",
          )}
        >
          <span
            aria-hidden
            className={cn("mr-1 font-v2-display text-(--gold)", featured && "text-4xl")}
          >
            «
          </span>
          {avis.texte}
          <span
            aria-hidden
            className={cn("ml-1 font-v2-display text-(--gold)", featured && "text-4xl")}
          >
            »
          </span>
        </blockquote>
      </div>

      <figcaption className="text-sm">
        <span className="block font-semibold tracking-wide">{avis.auteur}</span>
        <span className={cn("mt-1 block", featured ? "text-white/65" : "text-muted")}>
          {avis.chantier} · {avis.lieu}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Avis clients : une grande carte, quatre petites. Sur téléphone, les cartes défilent côte à côte.
 * Tant que les avis sont fictifs (voir lib/v2/avis.ts), un bandeau le dit ; en production, la
 * section disparaît plutôt que d'afficher de faux témoignages.
 */
export function HomeAvis() {
  const provisoire = AVIS.some((avis) => avis.fictif);
  if (provisoire && env.isProduction) return null;

  return (
    <section id="avis" aria-labelledby="avis-title" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            Avis clients
          </p>
          <h2
            id="avis-title"
            className="reveal mt-5 font-v2-display text-4xl leading-[1.1] text-navy md:text-6xl"
          >
            Ils nous ont fait <em className="text-blue">confiance</em>
          </h2>
        </div>

        {provisoire && (
          <p className="mx-auto mt-8 max-w-xl border border-dashed border-red/60 bg-red/5 px-4 py-3 text-center text-sm text-red-ink">
            Avis fictifs, pour la mise en page uniquement : à remplacer par de vrais avis avant la
            mise en ligne.
          </p>
        )}

        <ul
          aria-label="Avis de nos clients"
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {AVIS.map((avis, index) => (
            <li
              key={avis.id}
              className={cn(
                "shrink-0 basis-[84%] snap-center sm:basis-[56%] lg:basis-auto",
                index === 0 && "lg:col-span-2",
              )}
            >
              <Card avis={avis} featured={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
