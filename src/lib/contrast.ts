/** Contraste WCAG entre deux couleurs `oklch(L C h)` (L en 0–1). */

type Rgb = [number, number, number];

function parseOklch(value: string): { l: number; c: number; h: number } {
  const match = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value);
  if (!match) throw new Error(`oklch simple attendu (sans alpha) : ${value}`);
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

/** RGB linéaire (0–1) depuis oklch, via OKLab. */
function toLinearRgb(value: string): Rgb {
  const { l, c, h } = parseOklch(value);
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return [
    clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

function luminance(value: string): number {
  const [r, g, b] = toLinearRgb(value);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const [hi, lo] = [luminance(foreground), luminance(background)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}
