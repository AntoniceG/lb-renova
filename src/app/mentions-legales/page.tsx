import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { telHref } from "@/lib/brand";

const { brand, contact, certifications, legal } = siteConfig;

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${brand.name} : éditeur, hébergeur, assurance décennale et données personnelles.`,
  path: "/mentions-legales",
});

const linkClass =
  "font-semibold text-navy underline decoration-(--gold) decoration-2 underline-offset-4 hover:decoration-navy focus-visible:outline-blue";

/**
 * Affiche la valeur, ou un repère surligné tant qu'elle est encore à fournir (`TODO_` dans la config).
 * En production, la config refuse de se charger s'il en reste : ce repère ne peut donc jamais être publié.
 */
function Fill({ value, label }: { value: string; label: string }) {
  if (!isTodo(value)) return <>{value}</>;
  return (
    <mark className="rounded-sm bg-[oklch(0.93_0.1_92)] px-1.5 py-0.5 text-[0.85em] font-semibold text-navy-deep">
      À compléter : {label}
    </mark>
  );
}

/** Vrai si l'information a été fournie (absente ou encore en `TODO_` : la ligne n'est pas affichée). */
function known(value: string | undefined): value is string {
  return value !== undefined && !isTodo(value);
}

/** Lien vers un site extérieur (ou repère « à compléter » si l'adresse n'est pas encore connue). */
function Site({ url, label }: { url: string; label: string }) {
  if (isTodo(url)) return <Fill value={url} label={label} />;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {url.replace(/^https?:\/\//, "")}
    </a>
  );
}

function Email() {
  if (isTodo(contact.email)) return <Fill value={contact.email} label="e-mail de contact" />;
  return (
    <a href={`mailto:${contact.email}`} className={linkClass}>
      {contact.email}
    </a>
  );
}

function Liste({ children }: { children: ReactNode }) {
  return <dl className="space-y-3">{children}</dl>;
}

function Ligne({ label, children }: { label: string; children: ReactNode }) {
  if (children === null || children === undefined || children === false) return null;
  return (
    <div className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-xs font-semibold tracking-[0.16em] text-muted uppercase sm:pt-1">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function Bloc({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-navy/10 py-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-16"
    >
      <h2 id={id} className="font-v2-display text-2xl text-navy md:col-span-4 md:text-3xl">
        {title}
      </h2>
      <div className="space-y-4 leading-relaxed text-ink/85 md:col-span-8">{children}</div>
    </section>
  );
}

export default function V2LegalPage() {
  const { address } = contact;
  const siege =
    address && known(address.street) && known(address.postalCode) && known(address.city)
      ? `${address.street}, ${address.postalCode} ${address.city}`
      : null;
  const owner = isTodo(brand.legalName) ? brand.name : brand.legalName;
  // 9 chiffres = SIREN, 14 = SIRET : l'intitulé suit ce que le client a fourni.
  const numeroLabel = legal.siret.replace(/\D/g, "").length === 9 ? "SIREN" : "SIRET";

  return (
    <V2PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Mentions légales", path: "/mentions-legales" },
        ])}
      />
      <section className="v2-relief bg-(--cream) pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              Informations légales
            </p>
            <h1 className="mt-5 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
              Mentions <em className="text-blue">légales</em>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Qui édite ce site, qui l&apos;héberge, et comment sont traitées les informations que
              vous nous confiez.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white py-16 md:py-24">
        <div className="container-page">
          <Bloc id="editeur" title="Éditeur du site">
            <Liste>
              <Ligne label="Nom commercial">{brand.name}</Ligne>
              <Ligne label="Dénomination sociale">
                <Fill value={brand.legalName} label="raison sociale" />
              </Ligne>
              <Ligne label="Forme juridique">
                <Fill value={legal.legalForm} label="forme juridique" />
              </Ligne>
              {known(legal.capital) && <Ligne label="Capital social">{legal.capital}</Ligne>}
              {siege && <Ligne label="Siège social">{siege}</Ligne>}
              <Ligne label={numeroLabel}>
                <Fill value={legal.siret} label={numeroLabel} />
              </Ligne>
              {known(legal.registration) && (
                <Ligne label="Immatriculation">{legal.registration}</Ligne>
              )}
              {known(legal.vat) && <Ligne label="N° de TVA">{legal.vat}</Ligne>}
              <Ligne label="Téléphone">
                <a href={telHref(contact.phone.e164)} className={linkClass}>
                  {contact.phone.display}
                </a>
              </Ligne>
              <Ligne label="E-mail">
                <Email />
              </Ligne>
              <Ligne label="Directeur de la publication">
                <Fill value={legal.publicationDirector} label="directeur de la publication" />
              </Ligne>
            </Liste>
          </Bloc>

          <Bloc id="hebergeur" title="Hébergement">
            <Liste>
              <Ligne label="Hébergeur">{legal.host.name}</Ligne>
              <Ligne label="Adresse">{legal.host.address}</Ligne>
              <Ligne label="Site">
                <Site url={legal.host.website} label="site de l'hébergeur" />
              </Ligne>
              {known(legal.host.phone) && <Ligne label="Téléphone">{legal.host.phone}</Ligne>}
            </Liste>
          </Bloc>

          {certifications.decennale.enabled && (
            <Bloc id="decennale" title="Assurance décennale">
              <p>
                {brand.name} est couverte par une assurance de responsabilité civile décennale pour
                les travaux qu&apos;elle réalise.
              </p>
              {(known(certifications.decennale.insurer) ||
                known(legal.insurerAddress) ||
                known(legal.insuranceCoverage)) && (
                <Liste>
                  {known(certifications.decennale.insurer) && (
                    <Ligne label="Assureur">{certifications.decennale.insurer}</Ligne>
                  )}
                  {known(legal.insurerAddress) && (
                    <Ligne label="Adresse de l'assureur">{legal.insurerAddress}</Ligne>
                  )}
                  {known(legal.insuranceCoverage) && (
                    <Ligne label="Zone couverte">{legal.insuranceCoverage}</Ligne>
                  )}
                </Liste>
              )}
            </Bloc>
          )}

          {legal.mediator && known(legal.mediator.name) && known(legal.mediator.url) && (
            <Bloc id="mediation" title="Médiation de la consommation">
              <p>
                Tout consommateur a le droit de recourir gratuitement à un médiateur de la
                consommation pour résoudre à l&apos;amiable un litige qui l&apos;oppose à un
                professionnel. Avant de le saisir, adressez d&apos;abord votre réclamation par écrit
                à {owner}.
              </p>
              <Liste>
                <Ligne label="Médiateur">{legal.mediator.name}</Ligne>
                <Ligne label="Site">
                  <Site url={legal.mediator.url} label="site du médiateur" />
                </Ligne>
              </Liste>
            </Bloc>
          )}

          <Bloc id="donnees" title="Données personnelles">
            <p>
              Les informations saisies dans le formulaire de devis (type de projet, code postal du
              chantier, nom, téléphone, e-mail, ainsi que les précisions facultatives que vous
              ajoutez : type de bien, délais, description du projet, créneau de rappel) servent
              uniquement à répondre à votre demande et à vous rappeler.
            </p>
            <Liste>
              <Ligne label="Responsable du traitement">{owner}</Ligne>
              <Ligne label="Base légale">
                Votre consentement, donné en cochant la case du formulaire.
              </Ligne>
              <Ligne label="Destinataires">
                L&apos;équipe de {brand.name} et ses prestataires techniques (hébergement, base de
                données, envoi d&apos;e-mails, suivi des demandes, protection du formulaire contre
                les robots).
              </Ligne>
              <Ligne label="Conservation">
                3 ans maximum après notre dernier échange ; une demande laissée incomplète est
                supprimée au bout de 30 jours.
              </Ligne>
              <Ligne label="Vos droits">
                Accès, rectification, effacement, opposition et limitation : écrivez à <Email />.
                Vous pouvez aussi saisir la{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  CNIL
                </a>
                .
              </Ligne>
            </Liste>
          </Bloc>

          <Bloc id="cookies" title="Cookies et stockage">
            <p>
              Ce site n&apos;utilise ni cookie publicitaire, ni outil de mesure d&apos;audience.
            </p>
            <p>
              Pendant votre visite, votre navigateur garde en mémoire, le temps de l&apos;onglet,
              votre brouillon de demande de devis ainsi que la première page consultée et son
              origine (site d&apos;où vous venez, paramètres de campagne). Ces informations
              s&apos;effacent à la fermeture de l&apos;onglet ; elles ne sont transmises que si vous
              envoyez une demande de devis.
            </p>
            <p>
              Le formulaire est protégé contre les envois automatiques par le service Cloudflare
              Turnstile.
            </p>
          </Bloc>

          <Bloc id="propriete" title="Propriété intellectuelle">
            <p>
              Les textes, photographies, illustrations, logos et l&apos;ensemble du contenu de ce
              site sont protégés. Toute reproduction ou réutilisation sans l&apos;accord écrit de{" "}
              {owner} est interdite.
            </p>
            <p>Les marques citées appartiennent à leurs propriétaires respectifs.</p>
          </Bloc>
        </div>
      </div>
    </V2PageShell>
  );
}
