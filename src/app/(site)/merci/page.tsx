import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";
import { telHref } from "@/lib/brand";

const { brand, contact, promise } = siteConfig;

export const metadata: Metadata = {
  title: "Merci pour votre demande",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const callbackDelay = isTodo(promise.callbackDelay) ? null : promise.callbackDelay;
  const hasPhone = !isTodo(contact.phone.display) && !isTodo(contact.phone.e164);

  return (
    <section className="py-16 md:py-24">
      <div className="container-page max-w-2xl text-center">
        <CircleCheck aria-hidden className="mx-auto size-16 text-blue" />
        <h1 className="mt-6 text-display text-navy">Merci, votre demande est envoyée</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/90">
          {callbackDelay
            ? `${brand.name} vous rappelle ${callbackDelay} pour échanger sur votre projet.`
            : `${brand.name} vous rappelle rapidement pour échanger sur votre projet.`}{" "}
          Un email de confirmation vous est envoyé : pensez à regarder vos courriers indésirables
          s&apos;il tarde.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="default" size="xl" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
          {hasPhone && (
            <Button variant="outline" size="xl" asChild>
              <a href={telHref(contact.phone.e164)}>
                {siteConfig.nav.callLabel} {contact.phone.display}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
