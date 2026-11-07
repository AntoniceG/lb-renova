import { siteConfig } from "@/config/site.config";

/** Les deux villes mises en avant : Marseille est la base, Aix-en-Provence fait partie du secteur. */
const PRINCIPALES: readonly string[] = ["Marseille", "Aix-en-Provence"];

/**
 * Secteur d'intervention affiché sur la V2. Les autres villes viennent de la config du site
 * (`area.priorityCities`, fournies par le client) : rien n'est ajouté ici.
 */
export const ZONE = {
  principales: PRINCIPALES,
  autres: siteConfig.area.priorityCities.filter((ville) => !PRINCIPALES.includes(ville)),
} as const;
