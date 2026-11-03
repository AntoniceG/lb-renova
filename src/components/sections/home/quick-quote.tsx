"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { saveQuoteDraft } from "@/lib/quote-draft";

interface QuickQuoteProps {
  projectTypes: { value: string; label: string }[];
  quoteHref: string;
}

const POSTAL_CODE = /^\d{5}$/;

/**
 * Mini-formulaire d'accroche : aucune donnée n'est envoyée au serveur ici.
 * Le brouillon reste dans la session du navigateur et pré-remplit le devis complet.
 */
export function QuickQuote({ projectTypes, quoteHref }: QuickQuoteProps) {
  const router = useRouter();
  const typeId = useId();
  const postalId = useId();
  const errorId = useId();
  const [projectType, setProjectType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectType) return setError("Choisissez le type de projet.");
    if (!POSTAL_CODE.test(postalCode)) return setError("Indiquez un code postal à 5 chiffres.");
    setError(null);
    saveQuoteDraft({ projectType, postalCode });
    router.push(quoteHref);
  }

  const fieldClass =
    "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted focus-visible:border-blue";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-hero border border-white/30 bg-white p-6 text-ink shadow-elevated md:p-7"
    >
      <h2 className="font-display text-xl font-bold">Démarrez votre devis gratuit</h2>
      <p className="mt-1 text-sm text-muted">Deux informations pour commencer, sans engagement.</p>

      <div className="mt-5">
        <label htmlFor={typeId} className="text-sm font-semibold">
          Votre projet
        </label>
        <select
          id={typeId}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          aria-describedby={error ? errorId : undefined}
          className={fieldClass}
        >
          <option value="">Sélectionner…</option>
          {projectTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor={postalId} className="text-sm font-semibold">
          Code postal du chantier
        </label>
        <input
          id={postalId}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="13100"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
          aria-describedby={error ? errorId : undefined}
          className={fieldClass}
        />
      </div>

      <p id={errorId} role="alert" className="mt-3 min-h-5 text-sm font-medium text-red-ink">
        {error}
      </p>

      <Button type="submit" variant="cta" size="lg" className="mt-2 w-full">
        Continuer mon devis
        <ArrowRight aria-hidden />
      </Button>
    </form>
  );
}
