import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TricolorRule } from "@/components/brand/tricolor-rule";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";
import { contrastRatio } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const WHITE = "oklch(1 0 0)";

/** Page interne de validation de la DA ; 404 en production. */
export default function DesignSystemPage() {
  if (env.isProduction) notFound();
  const { colors } = siteConfig.brand;

  return (
    <div className="container-page space-y-16 py-16">
      <header>
        <p className="eyebrow">Design system — provisoire</p>
        <h1 className="mt-4 text-display">Palette & typographie</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Valeurs lues depuis <code>site.config.ts</code>. À recalibrer sur le logo final.
        </p>
      </header>

      <section aria-labelledby="ds-colors">
        <h2 id="ds-colors" className="text-title">
          Couleurs
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(colors).map(([key, value]) => (
            <li key={key} className="overflow-hidden rounded-card border border-line">
              <div className="h-20" style={{ background: value }} />
              <div className="p-3 text-xs">
                <p className="font-bold">{key}</p>
                <p className="text-muted">{value}</p>
                <p className="text-muted">sur blanc : {contrastRatio(value, WHITE).toFixed(1)}:1</p>
              </div>
            </li>
          ))}
        </ul>
        <TricolorRule className="mt-8 h-2 overflow-hidden rounded-full border border-line" />
      </section>

      <section aria-labelledby="ds-type">
        <h2 id="ds-type" className="text-title">
          Typographie
        </h2>
        <div className="mt-6 space-y-6">
          <p className="text-display">
            Rénovez <span className="font-light italic">sereinement</span>
          </p>
          <p className="text-title">Un titre de section éditorial</p>
          <p className="max-w-prose text-base leading-relaxed">
            Texte courant en Figtree : lisible sur mobile, avec une hauteur de ligne confortable
            pour les paragraphes de présentation des spécialités.
          </p>
          <p className="eyebrow">Eyebrow en petites capitales</p>
        </div>
      </section>

      <section aria-labelledby="ds-buttons">
        <h2 id="ds-buttons" className="text-title">
          Boutons
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="cta" size="xl">
            Recevoir mon devis gratuit
          </Button>
          <Button>Principal</Button>
          <Button variant="outline">Secondaire</Button>
          <Button variant="ghost">Discret</Button>
          <span className="rounded-full bg-navy p-2">
            <Button variant="ghostLight">Sur fond sombre</Button>
          </span>
        </div>
      </section>
    </div>
  );
}
