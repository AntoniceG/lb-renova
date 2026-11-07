"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/** Repère posé par l'en-tête : l'endroit exact où le logo vient se ranger. */
const HEADER_SLOT = "[data-logo-slot='header']";
/** Longueur du vol, en hauteurs d'écran de défilement (bornée entre 220 et 560 px). */
const TRAVEL_SCREENS = 0.6;
/** À partir de quelle part du vol l'en-tête commence à apparaître. */
const SHOW_HEADER_FROM = 0.4;
/** Cambrure de l'arc, en fraction de la distance à parcourir. */
const ARC = 0.18;
/** Inclinaison maximale en plein vol (degrés). */
const TILT = -14;

interface Geometry {
  /** Centre du logo dans le hero, page en haut : x et y à l'écran. */
  heroX: number;
  heroY: number;
  heroSize: number;
  /** Centre de l'emplacement dans l'en-tête (position fixe à l'écran). */
  headX: number;
  headY: number;
  headSize: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function measure(slot: HTMLElement): Geometry | null {
  const target = document.querySelector<HTMLElement>(HEADER_SLOT);
  if (!target) return null;
  const from = slot.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  return {
    heroX: from.left + from.width / 2,
    heroY: from.top + window.scrollY + from.height / 2,
    heroSize: from.width,
    headX: to.left + to.width / 2,
    headY: to.top + to.height / 2,
    headSize: to.width,
  };
}

interface HeroLogoProps {
  name: string;
}

/**
 * Le logo du hero, qui se fait « attraper » par le défilement : il décrit un arc jusqu'à
 * l'emplacement prévu dans l'en-tête (`data-logo-slot="header"`), s'y range avec un petit
 * « pop », et l'en-tête apparaît pendant le trajet. Tout est piloté par la position de scroll :
 * en remontant, le logo revient dans le hero.
 *
 * Au repos (et sans JavaScript) le logo est un simple élément du hero. Seul le défilement le
 * passe en position fixe. Attention : aucun parent de ce composant ne doit créer de contexte
 * d'empilement (z-index, isolate, transform, filter…), sinon le logo passerait sous l'en-tête.
 */
export function HeroLogo({ name }: HeroLogoProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const flyer = flyerRef.current;
    if (!slot || !flyer) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let geometry = measure(slot);
    let docked = false;
    let lastFlight = -1;

    const update = () => {
      if (!geometry) return;
      const scroll = Math.max(0, window.scrollY);
      const travel = Math.max(220, Math.min(window.innerHeight * TRAVEL_SCREENS, 560));
      const progress = clamp01(scroll / travel);
      const calm = reduceMotion.matches;
      const eased = calm ? progress : easeInOutCubic(progress);

      // Marques lues par l'en-tête (voir v2.css).
      const flight = Math.round(progress * 1000) / 1000;
      if (flight !== lastFlight) {
        root.style.setProperty("--flight", String(flight));
        lastFlight = flight;
      }
      root.toggleAttribute("data-flight-on", progress >= SHOW_HEADER_FROM);

      // Rangé dans l'en-tête : déclenche le « pop » (avec un peu de marge pour ne pas clignoter).
      const nowDocked = docked ? progress > 0.97 : progress >= 0.995;
      if (nowDocked !== docked) {
        docked = nowDocked;
        flyer.toggleAttribute("data-docked", docked);
      }

      if (scroll <= 0) {
        flyer.removeAttribute("data-flying");
        flyer.style.transform = "";
        return;
      }

      // Le logo se détache dès le premier pixel de défilement : il reste à sa place à l'écran
      // pendant que la page glisse en dessous, puis part vers l'en-tête.
      const startX = geometry.heroX;
      const startY = geometry.heroY;
      let x = lerp(startX, geometry.headX, eased);
      let y = lerp(startY, geometry.headY, eased);
      let rotation = 0;

      if (!calm) {
        const dx = geometry.headX - startX;
        const dy = geometry.headY - startY;
        const length = Math.hypot(dx, dy) || 1;
        // Perpendiculaire au trajet, orientée vers le haut : le logo passe au-dessus de la ligne droite.
        let nx = -dy / length;
        let ny = dx / length;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        const swing = Math.sin(Math.PI * eased);
        x += nx * swing * length * ARC;
        y += ny * swing * length * ARC;
        rotation = swing * TILT;
      }

      const size = lerp(geometry.heroSize, geometry.headSize, eased);
      const scale = size / geometry.heroSize;
      // L'arc ne doit jamais faire sortir le logo par le haut de l'écran.
      y = Math.max(y, size / 2 + 8);
      flyer.setAttribute("data-flying", "");
      flyer.style.transform = `translate3d(${x - geometry.heroSize / 2}px, ${
        y - geometry.heroSize / 2
      }px, 0) rotate(${rotation}deg) scale(${scale})`;
    };

    const remeasure = () => {
      geometry = measure(slot);
      if (geometry) flyer.style.setProperty("--logo-size", `${geometry.heroSize}px`);
      update();
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", remeasure);
    const observer = new ResizeObserver(remeasure);
    observer.observe(slot);
    remeasure();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
      root.style.removeProperty("--flight");
      root.removeAttribute("data-flight-on");
      flyer.removeAttribute("data-flying");
      flyer.removeAttribute("data-docked");
      flyer.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={slotRef}
      data-logo-slot="hero"
      className="relative aspect-square w-[min(68vw,23rem,46svh)]"
    >
      <Link
        ref={flyerRef}
        href="/v2"
        aria-label={`${name} — accueil`}
        className="logo-flyer focus-visible:outline-blue"
      >
        <span aria-hidden className="logo-flyer__ring" />
        <span className="logo-flyer__inner">
          {/* Version à texte blanc : sur la photo du hero. */}
          <Image
            src="/v2/logo-v2.webp"
            alt=""
            width={887}
            height={887}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 68vw, 368px"
            className="logo-flyer__img logo-flyer__img--sombre size-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          />
          {/* Version à texte marine : fond fondu par-dessus pendant le vol, pour l'en-tête blanc. */}
          <Image
            src="/v2/logo-v2-clair.webp"
            alt=""
            aria-hidden
            width={887}
            height={887}
            loading="eager"
            fetchPriority="low"
            sizes="(max-width: 640px) 68vw, 368px"
            className="logo-flyer__img logo-flyer__img--clair absolute inset-0 size-full"
          />
        </span>
      </Link>
    </div>
  );
}
