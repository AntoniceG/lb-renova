import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "mt-1.5 w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-muted focus-visible:border-blue";

function describedBy(...ids: (string | false | undefined)[]): string | undefined {
  const value = ids.filter(Boolean).join(" ");
  return value === "" ? undefined : value;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p
      id={id}
      role={message ? "alert" : undefined}
      className="mt-1.5 min-h-5 text-sm font-medium text-red-ink"
    >
      {message}
    </p>
  );
}

interface FieldBase {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

function Label({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="text-sm font-semibold">
      {label}
      {optional && <span className="ml-1 font-normal text-muted">(facultatif)</span>}
    </label>
  );
}

type TextFieldProps = FieldBase &
  Omit<ComponentProps<"input">, "id" | "className"> & { value: string; className?: string };

export function TextField({ label, error, hint, optional, className, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <Label id={id} label={label} optional={optional} />
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && `${id}-error`, hint && `${id}-hint`)}
        className={cn(controlClass, "h-12", error ? "border-red" : "border-line")}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

type TextAreaFieldProps = FieldBase &
  Omit<ComponentProps<"textarea">, "id" | "className"> & { value: string };

export function TextAreaField({ label, error, hint, optional, ...textarea }: TextAreaFieldProps) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && `${id}-error`, hint && `${id}-hint`)}
        className={cn(controlClass, "min-h-36 py-3", error ? "border-red" : "border-line")}
        {...textarea}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

type SelectFieldProps = FieldBase &
  Omit<ComponentProps<"select">, "id" | "className" | "children"> & {
    value: string;
    options: { value: string; label: string }[];
    placeholder: string;
  };

export function SelectField({
  label,
  error,
  hint,
  optional,
  options,
  placeholder,
  ...select
}: SelectFieldProps) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && `${id}-error`, hint && `${id}-hint`)}
        className={cn(controlClass, "h-12", error ? "border-red" : "border-line")}
        {...select}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface ChoiceGroupProps {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  columns?: 1 | 2;
}

/** Choix unique présenté en cartes : de vrais boutons radio, donc navigables au clavier. */
export function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  columns = 2,
}: ChoiceGroupProps) {
  const errorId = useId();
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className={cn("mt-2 grid gap-2", columns === 2 && "sm:grid-cols-2")}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex min-h-12 cursor-pointer items-center rounded-xl border bg-white px-4 py-2.5 text-base font-medium transition-colors hover:border-navy/40",
              "has-checked:border-blue has-checked:bg-sky has-checked:text-navy has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue",
              error ? "border-red" : "border-line",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              data-invalid={error ? "true" : undefined}
              aria-describedby={error ? errorId : undefined}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}

export function CheckboxField({ checked, onChange, error, children }: CheckboxFieldProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-5 shrink-0 accent-[var(--blue)]"
        />
        <label htmlFor={id} className="text-sm leading-relaxed">
          {children}
        </label>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
