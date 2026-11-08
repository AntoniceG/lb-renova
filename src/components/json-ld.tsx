/**
 * Données structurées (schema.org) : un petit bloc invisible que Google lit pour comprendre la page.
 * Le `<` est échappé pour qu'un texte ne puisse pas fermer la balise (recommandation de Next.js).
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | readonly Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
