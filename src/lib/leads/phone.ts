/**
 * Normalise un numéro français saisi librement vers le format E.164 (+33XXXXXXXXX).
 * Retourne `null` si le numéro n'est pas un numéro français valide.
 */
export function normalizeFrenchPhone(input: string): string | null {
  const compact = input.replace(/\(0\)/g, "").replace(/[\s.\-()]/g, "");
  if (/^\+33[1-9][0-9]{8}$/.test(compact)) return compact;
  if (/^0033[1-9][0-9]{8}$/.test(compact)) return `+${compact.slice(2)}`;
  if (/^0[1-9][0-9]{8}$/.test(compact)) return `+33${compact.slice(1)}`;
  return null;
}

/** Affichage lisible d'un numéro E.164 français : +33612345678 → 06 12 34 56 78. */
export function formatFrenchPhone(e164: string): string {
  const match = /^\+33([1-9])([0-9]{8})$/.exec(e164);
  if (!match) return e164;
  const digits = `0${match[1]}${match[2]}`;
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ");
}
