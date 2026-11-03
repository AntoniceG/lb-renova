"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { IconKey } from "@/config/site.schema";
import { ICONS } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface MenuService {
  slug: string;
  title: string;
  iconKey: IconKey;
}

/** Menu déroulant desktop : ouverture au clic, au survol et au clavier ; Échap ferme. */
export function ServicesMenu({ label, services }: { label: string; services: MenuService[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-ink/85 transition-colors hover:text-navy"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2"
      >
        <ul className="rounded-card border border-line bg-white p-2 shadow-elevated">
          {services.map(({ slug, title, iconKey }) => {
            const Icon = ICONS[iconKey];
            return (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface hover:text-navy"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-sky text-navy">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
