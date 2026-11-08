import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { ZONE } from "@/lib/v2/zone";
import { v2Button } from "./button-styles";

/** Secteur d'intervention : Marseille et Aix-en-Provence en grand, les autres communes en dessous. */
export function HomeZone() {
  const { nav } = siteConfig;
  const autres = ZONE.autres;

  return (
    <section
      id="zone"
      aria-labelledby="zone-title"
      className="v2-relief v2-relief--haut bg-(--cream) py-20 md:py-28"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            Zone d&apos;intervention
          </p>
          <h2
            id="zone-title"
            className="reveal mt-5 font-v2-display text-4xl leading-[1.1] text-navy md:text-5xl"
          >
            De Marseille à <em className="text-blue">Aix-en-Provence</em>
          </h2>
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            LB Rénova intervient à {ZONE.principales.join(" et à ")}, ainsi qu&apos;à{" "}
            {autres.slice(0, -1).join(", ")} et {autres.at(-1)}, et dans les communes alentour. Vous
            n&apos;êtes pas sûr d&apos;être dans notre secteur ? Décrivez votre projet, nous vous
            répondons.
          </p>
          <Link href={V2_QUOTE_HREF} className={`reveal mt-9 ${v2Button({ tone: "navy" })}`}>
            {nav.quoteLabel}
          </Link>
        </div>

        <div>
          <ul className="border-t border-navy/15">
            {ZONE.principales.map((ville) => (
              <li
                key={ville}
                className="reveal border-b border-navy/15 py-5 font-v2-display text-4xl text-navy md:text-5xl"
              >
                {ville}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
            {autres.map((ville) => (
              <li key={ville}>{ville}</li>
            ))}
            <li>et alentours</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
