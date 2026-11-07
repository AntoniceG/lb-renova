import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/quote-form";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { getProjectTypeOptions } from "@/lib/leads/options";

const { brand, contact, promise } = siteConfig;

// Page de travail de la refonte : jamais indexée avant la migration.
export const metadata: Metadata = {
  title: "Devis gratuit",
  description: `Décrivez votre projet de rénovation à Marseille et Aix-en-Provence : ${brand.name} vous rappelle et vous remet un devis détaillé et gratuit.`,
  robots: { index: false, follow: false },
};

/**
 * Page du devis de la refonte : le formulaire du site actuel (mêmes étapes, même envoi, mêmes
 * contrôles), habillé aux couleurs de la V2 avec de l'or à la place du bleu et du rouge.
 */
export default function V2QuotePage() {
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
    <V2PageShell>
      <section className="v2-relief bg-(--cream) pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              Devis gratuit
            </p>
            <h1 className="mt-5 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
              Parlons de votre <em className="text-blue">projet</em>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Quelques informations suffisent pour que {brand.name} revienne vers vous avec une
              réponse adaptée à votre chantier à Marseille, Aix-en-Provence et alentours.
            </p>
          </div>
        </div>
      </section>

      <section className="v2-or v2-devis bg-white py-12 md:py-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <QuoteForm
              accent="gold"
              successHref="/v2/merci"
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
            <h2 className="font-v2-display text-2xl text-navy">Ce qui se passe ensuite</h2>
            <ol className="mt-6 space-y-6">
              {nextSteps.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="w-10 shrink-0 font-v2-display text-3xl text-[oklch(0.7_0.14_70)] italic"
                  >
                    {String(index + 1).padStart(2, "0")}
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
    </V2PageShell>
  );
}
