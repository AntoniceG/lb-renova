import { CircleCheck, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { v2Button } from "@/components/v2/button-styles";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { telHref } from "@/lib/brand";

const { brand, contact, promise } = siteConfig;

export const metadata: Metadata = {
  title: "Merci pour votre demande",
  robots: { index: false, follow: false },
};

/** Page affichée après l'envoi du devis sur la refonte (voir `successHref` du formulaire). */
export default function V2ThankYouPage() {
  const callbackDelay = isTodo(promise.callbackDelay) ? null : promise.callbackDelay;
  const hasPhone = !isTodo(contact.phone.display) && !isTodo(contact.phone.e164);

  return (
    <V2PageShell>
      <section className="bg-(--cream) pt-36 pb-24 md:pt-48 md:pb-32">
        <div className="container-page max-w-2xl text-center">
          <CircleCheck
            aria-hidden
            strokeWidth={1.25}
            className="mx-auto size-16 text-[oklch(0.7_0.14_70)]"
          />
          <h1 className="mt-6 font-v2-display text-4xl leading-[1.1] text-balance text-navy md:text-6xl">
            Merci, votre demande est <em className="text-blue">envoyée</em>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85">
            {callbackDelay
              ? `${brand.name} vous rappelle ${callbackDelay} pour échanger sur votre projet.`
              : `${brand.name} vous rappelle rapidement pour échanger sur votre projet.`}{" "}
            Un email de confirmation vous est envoyé : pensez à regarder vos courriers indésirables
            s&apos;il tarde.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/v2" className={v2Button({ tone: "navy" })}>
              Retour à l&apos;accueil
            </Link>
            {hasPhone && (
              <a
                href={telHref(contact.phone.e164)}
                className="inline-flex min-h-12 items-center gap-2.5 border border-navy/30 px-8 text-[0.8rem] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-navy focus-visible:outline-blue"
              >
                <Phone aria-hidden className="size-4" />
                {contact.phone.display}
              </a>
            )}
          </div>
        </div>
      </section>
    </V2PageShell>
  );
}
