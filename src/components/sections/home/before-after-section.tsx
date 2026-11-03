import { SectionHeading } from "@/components/ui/section-heading";
import { demoBeforeAfter } from "@/content/demo";
import { BeforeAfter } from "./before-after";

/** Phase 3 : paire de démonstration. Les vraies paires avant/après arrivent avec les photos (phase 6 : admin). */
export function BeforeAfterSection() {
  return (
    <section aria-labelledby="avant-apres" className="bg-surface py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="avant-apres"
            eyebrow="Avant / Après"
            title="La transformation, en un geste"
          >
            Faites glisser le curseur pour comparer l&apos;état initial et le résultat d&apos;un
            chantier.
          </SectionHeading>
        </div>
        <div className="reveal lg:col-span-7">
          <BeforeAfter pair={demoBeforeAfter} demo />
        </div>
      </div>
    </section>
  );
}
