"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { BeforeAfterImage, BeforeAfterPair } from "@/content/demo";
import { cn } from "@/lib/utils";

interface BeforeAfterProps {
  pair: BeforeAfterPair;
  /** Contenu de démonstration : affiche un bandeau « Démo ». */
  demo?: boolean;
  className?: string;
}

function Side({
  image,
  label,
  tone,
}: {
  image: BeforeAfterImage;
  label: string;
  tone: "before" | "after";
}) {
  return (
    <div className="absolute inset-0">
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 40rem, 100vw"
          className="object-cover"
          draggable={false}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            "size-full",
            tone === "before"
              ? "bg-[linear-gradient(135deg,oklch(0.55_0.02_262),oklch(0.38_0.02_262))]"
              : "bg-[linear-gradient(135deg,oklch(0.6_0.12_258),oklch(0.3_0.08_262))]",
          )}
        />
      )}
      <span
        className={cn(
          "absolute top-4 rounded-full bg-navy-deep/80 px-3.5 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase backdrop-blur",
          tone === "before" ? "left-4" : "right-4",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Comparateur avant/après : un vrai `<input type="range">` couvre toute la zone, donc
 * glisser au doigt, à la souris et au clavier (flèches, Début, Fin) fonctionne nativement.
 */
export function BeforeAfter({ pair, demo = false, className }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const inputId = useId();

  return (
    <figure className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-hero bg-navy-deep shadow-elevated select-none">
        <Side image={pair.after} label="Après" tone="after" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Side image={pair.before} label="Avant" tone="before" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-elevated">
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <input
          id={inputId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Comparer l'avant et l'après"
          aria-valuetext={`${position} % avant, ${100 - position} % après`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />

        {demo && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-white px-4 py-1.5 text-xs font-bold text-red-ink">
            Visuel de démonstration
          </p>
        )}
      </div>
    </figure>
  );
}
