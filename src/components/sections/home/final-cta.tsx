import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { showDemo } from "@/content/demo";
import { telHref } from "@/lib/brand";

/** CTA final. `#devis` est la cible des boutons « devis » jusqu'au formulaire multi-étapes (phase 5). */
export function FinalCta() {
  const { area, contact, nav } = siteConfig;
  return (
    <section id="devis" aria-labelledby="cta-final" className="scroll-mt-24 pb-20 md:pb-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-hero bg-navy [background-image:radial-gradient(34rem_22rem_at_90%_0%,color-mix(in_oklab,var(--blue)_60%,transparent),transparent),radial-gradient(24rem_18rem_at_0%_100%,color-mix(in_oklab,var(--red)_30%,transparent),transparent)] p-8 text-white md:p-14">
          <h2 id="cta-final" className="max-w-2xl text-title">
            Un projet de rénovation à {area.baseCity} ?
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Décrivez-nous votre projet : nous revenons vers vous avec un devis détaillé et gratuit,
            sans engagement.
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
          {showDemo && (
            <p className="mt-6 text-sm text-white/60">
              Aperçu : le formulaire de devis multi-étapes est branché en phase 5.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
