import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd } from "@/lib/seo";
import { FAQ, type Question } from "@/lib/v2/faq";

interface HomeFaqProps {
  /** Questions affichées ; par défaut, celles de la page d'accueil. */
  items?: readonly Question[];
  title?: ReactNode;
  eyebrow?: string;
}

/** Questions fréquentes : des blocs qui s'ouvrent au clic, sans JavaScript (balise <details>). */
export function HomeFaq({
  items = FAQ,
  eyebrow = "Questions fréquentes",
  title = (
    <>
      Vous vous demandez <em className="text-blue">peut-être</em>
    </>
  ),
}: HomeFaqProps) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-white py-20 md:py-28">
      <JsonLd data={faqJsonLd(items)} />
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="reveal text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              {eyebrow}
            </p>
            <h2
              id="faq-title"
              className="reveal mt-5 font-v2-display text-4xl leading-[1.1] text-navy md:text-5xl"
            >
              {title}
            </h2>
          </div>

          <div className="mt-12 border-t border-navy/15">
            {items.map(({ question, reponse }) => (
              <details key={question} className="group border-b border-navy/15">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-v2-display text-xl text-navy marker:content-none focus-visible:outline-blue md:text-2xl [&::-webkit-details-marker]:hidden">
                  {question}
                  <Plus
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-6 shrink-0 text-blue transition-transform duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-2xl pb-6 text-base leading-relaxed text-ink/80 md:text-lg">
                  {reponse}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
