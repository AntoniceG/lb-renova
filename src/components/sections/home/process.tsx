import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/home";

interface ProcessProps {
  steps?: readonly { title: string; text: string }[];
  title?: string;
}

export function Process({
  steps = processSteps,
  title = "De la première visite à la réception, en 4 étapes",
}: ProcessProps) {
  return (
    <section aria-labelledby="methode" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="methode" eyebrow="Notre méthode" title={title} align="center" />
        <ol className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal relative rounded-card border border-line bg-white p-6"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy font-display text-xl font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
