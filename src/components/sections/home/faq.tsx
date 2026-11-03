import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FaqItem } from "@/content/home";

interface FaqProps {
  items: FaqItem[];
  title?: string;
}

/** FAQ en `<details>` natifs : accessible au clavier et lisible sans JavaScript. */
export function Faq({ items, title = "Vos questions, nos réponses" }: FaqProps) {
  return (
    <section aria-labelledby="faq" className="bg-surface py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeading id="faq" eyebrow="Questions fréquentes" title={title} />
        </div>
        <div className="space-y-3 md:col-span-8">
          {items.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-card border border-line bg-white open:shadow-elevated"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-display text-lg font-bold text-navy [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
