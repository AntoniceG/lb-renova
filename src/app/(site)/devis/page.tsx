import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/quote-form";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { getProjectTypeOptions } from "@/lib/leads/options";

const { brand, area, contact, promise } = siteConfig;

export const metadata: Metadata = {
  title: "Devis gratuit",
  description: `Décrivez votre projet de rénovation à ${area.baseCity} et ses environs : ${brand.name} vous rappelle et vous remet un devis détaillé et gratuit.`,
  alternates: { canonical: "/devis" },
  // Page de conversion sans contenu éditorial : inutile dans l'index.
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  const callbackDelay = isTodo(promise.callbackDelay) ? null : promise.callbackDelay;
  const phoneDisplay = isTodo(contact.phone.display) ? null : contact.phone.display;

  const nextSteps = [
    { title: "Vous décrivez votre projet", text: "Quatre étapes courtes, sans engagement." },
    {
      title: callbackDelay ? `Nous vous rappelons ${callbackDelay}` : "Nous vous rappelons",
      text: "Pour échanger de vive voix sur votre projet et vos contraintes.",
    },
    {
      title: "Devis détaillé et gratuit",
      text: "Nous étudions votre projet, si besoin sur place, puis nous vous remettons un devis.",
    },
  ];

  return (
    <>
      <section className="bg-navy-deep [background-image:radial-gradient(50rem_30rem_at_90%_-10%,color-mix(in_oklab,var(--blue)_55%,transparent),transparent),radial-gradient(30rem_24rem_at_-5%_110%,color-mix(in_oklab,var(--red)_26%,transparent),transparent)] text-white">
        <div className="container-page py-14 md:py-20">
          <p className="eyebrow text-white/70">Devis gratuit</p>
          <h1 className="mt-4 max-w-3xl text-display">Parlons de votre projet</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            Quelques informations suffisent pour que {brand.name} revienne vers vous avec une
            réponse adaptée à votre chantier à {area.baseCity} et dans un rayon de {area.radiusKm}{" "}
            km.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <QuoteForm
              projectTypes={getProjectTypeOptions()}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null}
              callbackDelay={callbackDelay}
              phoneDisplay={phoneDisplay}
              consentNotice={{
                controller: isTodo(brand.legalName) ? brand.name : brand.legalName,
                contactEmail: isTodo(contact.email) ? null : contact.email,
                retention: "3 ans maximum après notre dernier échange",
              }}
            />
          </div>

          <aside aria-label="Après votre demande" className="lg:col-span-4">
            <h2 className="font-display text-xl font-bold text-navy">Ce qui se passe ensuite</h2>
            <ol className="mt-5 space-y-5">
              {nextSteps.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red font-display font-extrabold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{item.title}</p>
                    <p className="mt-1 text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
