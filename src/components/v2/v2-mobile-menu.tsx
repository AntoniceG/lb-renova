"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { V2NavLink } from "@/lib/v2/nav";
import { v2Button } from "./button-styles";

interface V2MobileMenuProps {
  /** Page intérieure : fond blanc dès le haut de page, donc bouton marine d'emblée. */
  solid?: boolean;
  links: readonly V2NavLink[];
  quote: { label: string; href: string };
  phone: { label: string; href: string };
}

/**
 * Menu des petits écrans. Le bouton est fixe en haut à droite : il reste visible même quand
 * l'en-tête n'est pas encore apparu (haut de la page d'accueil, avant que le logo s'envole). Sa
 * couleur change selon le fond (voir `.v2-burger` dans v2.css). Le panneau blanc recouvre la
 * page ; Échap ou un clic sur un lien le referme.
 */
export function V2MobileMenu({ solid = false, links, quote, phone }: V2MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    // La page ne défile plus derrière le panneau.
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        data-open={open ? "" : undefined}
        data-solid={solid ? "" : undefined}
        onClick={() => setOpen((value) => !value)}
        className="v2-burger fixed top-3 right-3 z-60 inline-flex size-12 items-center justify-center focus-visible:outline-blue"
      >
        {open ? <X aria-hidden className="size-7" /> : <Menu aria-hidden className="size-7" />}
      </button>

      <nav
        id={panelId}
        hidden={!open}
        aria-label="Menu principal"
        className="fixed inset-0 z-55 overflow-y-auto bg-white px-6 pt-28 pb-10 text-navy"
      >
        <ul className="flex flex-col">
          {links.map(({ label, href }) => (
            <li key={href} className="border-b border-navy/10">
              <Link
                href={href}
                onClick={close}
                className="flex min-h-16 items-center font-v2-display text-3xl focus-visible:outline-blue"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-5">
          <a
            href={phone.href}
            className="inline-flex min-h-12 items-center gap-3 text-lg font-semibold focus-visible:outline-blue"
          >
            <Phone aria-hidden className="size-5" />
            {phone.label}
          </a>
          <Link href={quote.href} onClick={close} className={v2Button({ tone: "navy" })}>
            {quote.label}
          </Link>
        </div>
      </nav>
    </div>
  );
}
