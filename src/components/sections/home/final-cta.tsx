import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { telHref } from "@/lib/brand";

interface FinalCtaProps {
  title?: string;
  anchorId?: string;
}

export function FinalCta({ title, anchorId }: FinalCtaProps) {
  const { area, contact, nav } = siteConfig;
  return (
    <section id={anchorId} aria-labelledby="cta-final" className="scroll-mt-24 pb-20 md:pb-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-hero bg-navy [background-image:radial-gradient(34rem_22rem_at_90%_0%,color-mix(in_oklab,var(--blue)_60%,transparent),transparent),radial-gradient(24rem_18rem_at_0%_100%,color-mix(in_oklab,var(--red)_30%,transparent),transparent)] p-8 text-white md:p-14">
          <h2 id="cta-final" className="max-w-2xl text-title">
            {title ?? `Un projet de rénovation à ${area.baseCity} ?`}
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
        </div>
      </div>
    </section>
  );
}
