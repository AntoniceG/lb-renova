import Link from "next/link";
import { v2Button } from "@/components/v2/button-styles";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";

export default function NotFound() {
  const { nav } = siteConfig;
  return (
    <V2PageShell>
      <section className="bg-(--cream) pt-36 pb-24 md:pt-48 md:pb-32">
        <div className="container-page max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">Erreur 404</p>
          <h1 className="mt-5 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
            Cette page <em className="text-blue">n&apos;existe pas</em>
          </h1>
          <p className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-ink/80">
            Le lien est peut-être erroné ou la page a été déplacée.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className={v2Button({ tone: "navy" })}>
              Retour à l&apos;accueil
            </Link>
            <Link
              href={nav.quoteHref}
              className="inline-flex min-h-12 items-center border border-navy/30 px-8 text-[0.8rem] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy focus-visible:outline-blue"
            >
              {nav.quoteLabel}
            </Link>
          </div>
        </div>
      </section>
    </V2PageShell>
  );
}
