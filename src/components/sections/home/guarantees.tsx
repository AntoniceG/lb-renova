import { Download } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { UI_ICONS } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

export function Guarantees() {
  const { certifications } = siteConfig;
  const cards = [
    ...(certifications.decennale.enabled
      ? [
          {
            key: "decennale",
            icon: UI_ICONS.shield,
            title: "Assurance décennale",
            text: "Vos travaux de construction sont couverts par la garantie décennale : dix ans à compter de la réception pour les dommages qui compromettent la solidité de l'ouvrage.",
            attestationUrl: certifications.decennale.attestationUrl,
          },
        ]
      : []),
    ...(certifications.rge.enabled
      ? [
          {
            key: "rge",
            icon: UI_ICONS.badge,
            title: "Qualifié RGE",
            text: "Entreprise qualifiée RGE (Reconnu Garant de l'Environnement).",
            attestationUrl: undefined,
          },
        ]
      : []),
    {
      key: "quote",
      icon: UI_ICONS.quote,
      title: "Devis gratuit, sans engagement",
      text: "Un devis détaillé, poste par poste, après la visite. Vous décidez ensuite, sans pression.",
      attestationUrl: undefined,
    },
    {
      key: "specialist",
      icon: UI_ICONS.specialist,
      title: "Un spécialiste par métier",
      text: "Maçonnerie, couverture, climatisation : chaque corps de métier est porté par un spécialiste de l'entreprise.",
      attestationUrl: undefined,
    },
  ];

  return (
    <section aria-labelledby="garanties" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="garanties"
          eyebrow="Nos garanties"
          title="Des engagements clairs, avant et après le chantier"
        />
        <ul
          className={`mt-12 grid gap-5 sm:grid-cols-2 ${cards.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
        >
          {cards.map(({ key, icon: Icon, title, text, attestationUrl }, i) => (
            <li
              key={key}
              className="reveal flex flex-col rounded-card border border-line bg-white p-6"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky text-navy">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
              {attestationUrl && (
                <Button variant="outline" size="default" asChild className="mt-5 self-start">
                  <a href={attestationUrl} download>
                    <Download aria-hidden />
                    Télécharger l&apos;attestation
                  </a>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
