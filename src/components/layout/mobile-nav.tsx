"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/components/ui/icons";
import type { MenuService } from "./services-menu";

interface MobileNavProps {
  servicesLabel: string;
  services: MenuService[];
  links: { label: string; href: string }[];
  quote: { label: string; href: string };
  phone: { label: string; href: string };
}

export function MobileNav({ servicesLabel, services, links, quote, phone }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-full text-navy hover:bg-surface"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      <nav
        id={panelId}
        hidden={!open}
        aria-label="Menu principal"
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-white shadow-elevated"
      >
        <div className="container-page flex flex-col gap-1 py-4">
          <p className="px-3 pt-2 pb-1 text-xs font-bold tracking-[0.18em] text-muted uppercase">
            {servicesLabel}
          </p>
          {services.map(({ slug, title, iconKey }) => {
            const Icon = ICONS[iconKey];
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                onClick={close}
                className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold hover:bg-surface"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-sky text-navy">
                  <Icon aria-hidden className="size-4" />
                </span>
                {title}
              </Link>
            );
          })}
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold hover:bg-surface"
            >
              {label}
            </Link>
          ))}
          <a
            href={phone.href}
            className="mt-2 flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold hover:bg-surface"
          >
            <Phone aria-hidden className="size-5 text-navy" />
            {phone.label}
          </a>
          <Button variant="cta" size="lg" asChild className="mt-2">
            <Link href={quote.href} onClick={close}>
              {quote.label}
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
