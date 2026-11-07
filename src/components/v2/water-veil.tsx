interface WaterVeilProps {
  /** Opacité du voile bleu (0 à 1). */
  veil: number;
  /** Intensité de la lueur dorée (0 à 1) ; réchauffe aussi le bleu du voile. */
  warmth: number;
}

/**
 * Deux calques par-dessus la photo de l'eau : un voile marine qui fait ressortir le logo, et une
 * lueur dorée de fin d'après-midi qui monte depuis l'eau. À placer juste après `WaterCanvas`.
 */
export function WaterVeil({ veil, warmth }: WaterVeilProps) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: veil,
          backgroundColor: `color-mix(in oklab, var(--navy-deep) ${Math.round(100 - warmth * 45)}%, oklch(0.3 0.07 40))`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: warmth,
          backgroundImage:
            "linear-gradient(to top, oklch(0.84 0.15 75) 0%, oklch(0.74 0.14 55) 38%, oklch(0.6 0.1 40 / 0.4) 70%, transparent 100%)",
        }}
      />
    </>
  );
}
