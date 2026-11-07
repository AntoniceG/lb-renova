"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { submitQuote } from "@/app/(site)/devis/actions";
import { Button } from "@/components/ui/button";
import { readAttribution } from "@/lib/attribution";
import type { ProjectTypeOption } from "@/lib/leads/options";
import {
  CALL_SLOT_LABELS,
  CALL_SLOTS,
  OCCUPANCIES,
  OCCUPANCY_LABELS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
  TIMELINES,
  TIMELINE_LABELS,
  createLeadSchemas,
  toFieldErrors,
} from "@/lib/leads/schema";
import { clearQuoteDraft, parseQuoteDraft, readQuoteDraftRaw } from "@/lib/quote-draft";
import { CheckboxField, ChoiceGroup, SelectField, TextAreaField, TextField } from "./fields";
import { TurnstileWidget } from "./turnstile-widget";

export interface ConsentNotice {
  controller: string;
  /** Moyen de contact RGPD ; `null` tant que l'email de l'entreprise n'est pas défini. */
  contactEmail: string | null;
  retention: string;
}

interface QuoteFormProps {
  projectTypes: ProjectTypeOption[];
  turnstileSiteKey: string | null;
  callbackDelay: string | null;
  phoneDisplay: string | null;
  consentNotice: ConsentNotice;
  /** Couleur d'accent de la progression et des boutons (`gold` : refonte V2). Les erreurs restent rouges. */
  accent?: "red" | "gold";
  /** Page affichée après l'envoi ; `/merci` par défaut (`/v2/merci` sur la refonte). */
  successHref?: string;
}

interface FormValues {
  projectType: string;
  postalCode: string;
  propertyType: string;
  occupancy: string;
  timeline: string;
  description: string;
  fullName: string;
  phone: string;
  email: string;
  callSlot: string;
  consent: boolean;
}

const EMPTY_VALUES: FormValues = {
  projectType: "",
  postalCode: "",
  propertyType: "",
  occupancy: "",
  timeline: "",
  description: "",
  fullName: "",
  phone: "",
  email: "",
  callSlot: "",
  consent: false,
};

const STEPS = [
  { key: "project", title: "Votre projet", fields: ["projectType", "postalCode"] },
  { key: "details", title: "Votre bien", fields: ["propertyType", "occupancy", "timeline"] },
  { key: "description", title: "Votre description", fields: ["description"] },
  {
    key: "contact",
    title: "Vos coordonnées",
    fields: ["fullName", "phone", "email", "callSlot", "consent"],
  },
] as const;

const toOptions = <T extends string>(values: readonly T[], labels: Record<T, string>) =>
  values.map((value) => ({ value, label: labels[value] }));

/** Lit le brouillon du mini-formulaire une fois côté navigateur, sans écart d'hydratation. */
export function QuoteForm(props: QuoteFormProps) {
  const rawDraft = useSyncExternalStore(
    () => () => undefined,
    readQuoteDraftRaw,
    () => null,
  );
  const draft = useMemo(() => parseQuoteDraft(rawDraft), [rawDraft]);
  return <QuoteFormSteps key={draft ? "draft" : "empty"} {...props} draft={draft} />;
}

function QuoteFormSteps({
  projectTypes,
  turnstileSiteKey,
  callbackDelay,
  phoneDisplay,
  consentNotice,
  accent = "red",
  successHref = "/merci",
  draft,
}: QuoteFormProps & { draft: { projectType: string; postalCode: string } | null }) {
  const router = useRouter();
  const gold = accent === "gold";
  const schemas = useMemo(
    () => createLeadSchemas(projectTypes.map((option) => option.value)),
    [projectTypes],
  );

  const [step, setStep] = useState(draft ? 1 : 0);
  const [values, setValues] = useState<FormValues>({ ...EMPTY_VALUES, ...draft });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [honeypot, setHoneypot] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);

  useEffect(() => {
    if (focusHeading.current) {
      headingRef.current?.focus();
      focusHeading.current = false;
    }
  }, [step]);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')
      ?.focus();
  }, [errors]);

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(stepIndex: number): Record<string, string> {
    const key = STEPS[stepIndex]?.key ?? "project";
    const result = schemas[key].safeParse(values);
    return result.success ? {} : toFieldErrors(result.error);
  }

  function goTo(next: number) {
    focusHeading.current = true;
    setErrors({});
    setFormError(null);
    setStep(next);
  }

  async function send() {
    if (!token) {
      setFormError("Validez la vérification anti-robot avant d'envoyer votre demande.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const attribution = readAttribution();
      const result = await submitQuote({
        ...values,
        website: honeypot,
        turnstileToken: token,
        utm: attribution?.utm ?? {},
        landingPath: attribution?.landingPath,
        referrer: attribution?.referrer ?? undefined,
      });

      if (result.ok) {
        clearQuoteDraft();
        router.push(successHref);
        return;
      }

      setSubmitting(false);
      setToken(null);
      setResetKey((key) => key + 1);
      if (result.error === "invalid") {
        const firstKey = Object.keys(result.fieldErrors)[0];
        const target = STEPS.findIndex((candidate) =>
          (candidate.fields as readonly string[]).includes(firstKey ?? ""),
        );
        focusHeading.current = false;
        setErrors(result.fieldErrors);
        setStep(target === -1 ? 0 : target);
      } else if (result.error === "captcha") {
        setFormError("La vérification anti-robot a expiré. Merci de la refaire puis de renvoyer.");
      } else {
        setFormError(
          `Une erreur est survenue, votre demande n'a pas été envoyée. Réessayez dans un instant${
            phoneDisplay ? ` ou appelez-nous au ${phoneDisplay}` : ""
          }.`,
        );
      }
    } catch {
      setSubmitting(false);
      setToken(null);
      setResetKey((key) => key + 1);
      setFormError("Connexion impossible. Vérifiez votre réseau puis réessayez.");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const stepErrors = validate(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    void send();
  }

  const current = STEPS[step] ?? STEPS[0];

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-hero border border-line bg-white p-6 shadow-elevated md:p-10"
    >
      <p className="text-sm font-semibold text-muted" aria-live="polite">
        Étape {step + 1} sur {STEPS.length} : {current.title}
      </p>
      <ol aria-label="Progression" className="mt-3 grid grid-cols-4 gap-2">
        {STEPS.map((item, index) => (
          <li
            key={item.key}
            aria-current={index === step ? "step" : undefined}
            className={`h-1.5 rounded-full ${
              index <= step ? (gold ? "bg-[oklch(0.78_0.14_70)]" : "bg-red") : "bg-line"
            }`}
          >
            <span className="sr-only">{item.title}</span>
          </li>
        ))}
      </ol>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 font-display text-2xl font-bold text-navy outline-none"
      >
        {current.title}
      </h2>

      <div className="mt-6 space-y-6">
        {step === 0 && (
          <>
            <ChoiceGroup
              legend="Quel est votre projet ?"
              name="projectType"
              options={projectTypes}
              value={values.projectType}
              onChange={(value) => setValue("projectType", value)}
              error={errors.projectType}
            />
            <TextField
              label="Code postal du chantier"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="13100"
              value={values.postalCode}
              onChange={(event) => setValue("postalCode", event.target.value.replace(/\D/g, ""))}
              error={errors.postalCode}
              className="max-w-xs"
            />
          </>
        )}

        {step === 1 && (
          <>
            <ChoiceGroup
              legend="Type de bien"
              name="propertyType"
              options={toOptions(PROPERTY_TYPES, PROPERTY_TYPE_LABELS)}
              value={values.propertyType}
              onChange={(value) => setValue("propertyType", value)}
              error={errors.propertyType}
            />
            <ChoiceGroup
              legend="Vous êtes"
              name="occupancy"
              options={toOptions(OCCUPANCIES, OCCUPANCY_LABELS)}
              value={values.occupancy}
              onChange={(value) => setValue("occupancy", value)}
              error={errors.occupancy}
            />
            <ChoiceGroup
              legend="Quand souhaitez-vous démarrer ?"
              name="timeline"
              options={toOptions(TIMELINES, TIMELINE_LABELS)}
              value={values.timeline}
              onChange={(value) => setValue("timeline", value)}
              error={errors.timeline}
            />
          </>
        )}

        {step === 2 && (
          <TextAreaField
            label="Décrivez votre projet"
            optional
            maxLength={4000}
            placeholder="Pièces concernées, ce que vous souhaitez obtenir, contraintes éventuelles…"
            hint="Quelques lignes suffisent. Évitez les informations sensibles. Nous échangerons les photos et plans par la suite."
            value={values.description}
            onChange={(event) => setValue("description", event.target.value)}
            error={errors.description}
          />
        )}

        {step === 3 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Nom et prénom"
                autoComplete="name"
                value={values.fullName}
                onChange={(event) => setValue("fullName", event.target.value)}
                error={errors.fullName}
              />
              <TextField
                label="Téléphone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                value={values.phone}
                onChange={(event) => setValue("phone", event.target.value)}
                error={errors.phone}
              />
            </div>
            <TextField
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={values.email}
              onChange={(event) => setValue("email", event.target.value)}
              error={errors.email}
            />
            <SelectField
              label="Quand préférez-vous être rappelé ?"
              optional
              placeholder="Peu importe"
              options={toOptions(CALL_SLOTS, CALL_SLOT_LABELS)}
              value={values.callSlot}
              onChange={(event) => setValue("callSlot", event.target.value)}
              error={errors.callSlot}
            />

            {/* Champ piège : invisible et hors parcours clavier pour un humain. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Ne pas remplir
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </label>
            </div>

            <CheckboxField
              checked={values.consent}
              onChange={(checked) => setValue("consent", checked)}
              error={errors.consent}
            >
              J&apos;accepte d&apos;être recontacté(e) au sujet de ma demande de devis et que mes
              informations soient utilisées à cette seule fin.
            </CheckboxField>

            <details className="rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted">
              <summary className="cursor-pointer font-semibold text-ink">
                Comment vos données sont utilisées
              </summary>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>Responsable du traitement : {consentNotice.controller}.</li>
                <li>Finalité : répondre à votre demande de devis et vous rappeler.</li>
                <li>Base légale : votre consentement.</li>
                <li>
                  Destinataires : l&apos;équipe et ses prestataires techniques (hébergement, envoi
                  d&apos;emails).
                </li>
                <li>Conservation : {consentNotice.retention}.</li>
                <li>
                  Vos droits (accès, rectification, suppression) :{" "}
                  {consentNotice.contactEmail
                    ? `écrivez à ${consentNotice.contactEmail}`
                    : "répondez à l'email de confirmation que vous recevrez"}
                  .
                </li>
              </ul>
            </details>

            {turnstileSiteKey ? (
              <TurnstileWidget siteKey={turnstileSiteKey} onToken={setToken} resetKey={resetKey} />
            ) : (
              <p role="alert" className="text-sm font-medium text-red-ink">
                Le formulaire est momentanément indisponible
                {phoneDisplay ? ` : appelez-nous au ${phoneDisplay}.` : "."}
              </p>
            )}
          </>
        )}
      </div>

      {formError && (
        <p role="alert" className="mt-6 rounded-xl bg-red/10 p-4 text-sm font-medium text-red-ink">
          {formError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="outline" size="lg" onClick={() => goTo(step - 1)}>
            <ArrowLeft aria-hidden />
            Retour
          </Button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <Button type="submit" variant={gold ? "gold" : "cta"} size="lg">
            Continuer
            <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button
            type="submit"
            variant={gold ? "gold" : "cta"}
            size="lg"
            disabled={submitting || !turnstileSiteKey}
          >
            {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
            <Send aria-hidden />
          </Button>
        )}
      </div>

      {step === STEPS.length - 1 && callbackDelay && (
        <p className="mt-4 text-center text-sm text-muted">
          Devis gratuit et sans engagement. Nous vous rappelons {callbackDelay}.
        </p>
      )}
    </form>
  );
}
