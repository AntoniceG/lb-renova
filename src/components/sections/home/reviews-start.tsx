import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { isTodo } from "@/config/site.schema";

/**
 * État « démarrage » honnête : aucune note, aucun compteur, aucun avis tant qu'il n'y en a pas de réels.
 * Le carrousel d'avis réels arrive avec la table `reviews` (phase 6).
 */
export function ReviewsStart() {
  const { googleBusinessUrl } = siteConfig.contact;
  const hasGoogleLink = !isTodo(googleBusinessUrl);

  return (
    <section aria-labelledby="avis" className="py-20 md:py-28">
      <div className="container-page">
        <div className="rounded-hero border border-line bg-white p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-12">
          <SectionHeading
            id="avis"
            eyebrow="Avis clients"
            title="Vos avis, publiés au fil des chantiers"
          >
            Après chaque chantier, nous invitons nos clients à partager leur expérience sur Google.
            Leurs retours apparaîtront ici.
          </SectionHeading>
          {hasGoogleLink && (
            <Button variant="outline" size="lg" asChild className="mt-6 shrink-0 md:mt-0">
              <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                Voir notre fiche Google
                <ExternalLink aria-hidden />
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
