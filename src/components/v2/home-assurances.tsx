import { ASSURANCES } from "@/lib/v2/assurances";

/**
 * Bandeau de réassurance : pleine largeur, posé sous le hero (il ne le chevauche pas).
 * Trois badges alignés, sans séparation entre eux ; aucun arrondi, aucun effet « bouton ».
 * Une ombre dorée (la même lueur que dans le hero et les cartes d'expertises) lui donne du relief.
 * `relative z-20` : sans cela, la section suivante (crème elle aussi, en `z-10`) recouvrirait
 * l'ombre ; il faut donc rester au-dessus d'elle.
 */
export function HomeAssurances() {
  return (
    <section
      aria-label="Nos engagements"
      className="relative z-20 border-y border-[oklch(0.8_0.12_75/0.35)] bg-(--cream) shadow-[0_16px_38px_-14px_oklch(0.78_0.14_70/0.6)]"
    >
      <ul className="container-page grid grid-cols-3">
        {ASSURANCES.map(({ key, label, icon: Icon }) => (
          <li
            key={key}
            className="flex flex-col items-center justify-center gap-2.5 px-2 py-5 text-center md:flex-row md:gap-4 md:py-7"
          >
            <Icon aria-hidden strokeWidth={1.5} className="size-6 shrink-0 text-blue md:size-8" />
            <span className="text-[0.62rem] leading-tight font-semibold tracking-[0.1em] text-navy uppercase md:text-[0.78rem] md:tracking-[0.18em]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
