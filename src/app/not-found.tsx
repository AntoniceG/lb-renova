import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";

export default function NotFound() {
  const { nav } = siteConfig;
  return (
    <SiteShell>
      <section className="container-page py-24 text-center md:py-32">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-display">Cette page n&apos;existe pas.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          Le lien est peut-être erroné ou la page a été déplacée.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="xl" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href={nav.quoteHref}>{nav.quoteLabel}</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
