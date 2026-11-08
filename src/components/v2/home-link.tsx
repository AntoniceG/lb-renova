"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

/** Page d'accueil de la refonte (deviendra « / » à la migration). */
export const V2_HOME_HREF = "/v2";

type V2HomeLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Lien « retour à l'accueil » des logos. Sur une autre page, c'est un lien normal. Sur l'accueil
 * lui-même, Next.js ne refait rien (la page est déjà « là ») : le clic ne remontait donc pas, et
 * depuis le pied de page on restait en bas. Ici on remonte nous-mêmes tout en haut, en douceur
 * (le défilement doux est réglé dans globals.css et se coupe si le visiteur préfère moins de mouvement).
 */
export function V2HomeLink({ onClick, ...props }: V2HomeLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified || event.button !== 0) return;
    if (pathname === V2_HOME_HREF) {
      event.preventDefault();
      window.scrollTo({ top: 0 });
    }
  };

  return <Link {...props} href={V2_HOME_HREF} onClick={handleClick} />;
}
