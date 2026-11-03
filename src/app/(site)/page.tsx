import { siteConfig } from "@/config/site.config";

/** Page d'attente : la landing « Rénovation » est livrée en phase 3. */
export default function HomePage() {
  const { brand } = siteConfig;
  return (
    <section className="bg-navy text-white">
      <div className="container-page py-24 md:py-32">
        <p className="text-xs font-bold tracking-[0.18em] text-white/70 uppercase">
          {brand.tagline}
        </p>
        <h1 className="mt-5 max-w-3xl text-display">{brand.name}</h1>
        <p className="mt-6 max-w-xl text-lg text-white/80">
          Site en construction. La page d&apos;accueil arrive à la prochaine phase.
        </p>
        <div id="devis" className="mt-10 scroll-mt-28 text-sm text-white/60">
          Emplacement du formulaire de devis (phase 5).
        </div>
      </div>
    </section>
  );
}
