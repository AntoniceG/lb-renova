"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { HeroSlide } from "@/content/home";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6000;

interface StageState {
  slides: HeroSlide[];
  index: number;
  animated: boolean;
  /** Les visuels 2…n ne se chargent qu'une fois la page au repos (LCP). */
  idle: boolean;
  select: (index: number) => void;
}

const StageContext = createContext<StageState | null>(null);

function useStage(): StageState {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("Composant du hero utilisé hors <HeroStage>.");
  return ctx;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

interface HeroStageProps {
  slides: HeroSlide[];
  className?: string;
  children: ReactNode;
}

/**
 * Conteneur du hero : porte l'état du diaporama (index, pause, onglet masqué, idle).
 * Pause au survol, au focus clavier et quand l'onglet est masqué ; figé si mouvement réduit.
 */
export function HeroStage({ slides, className, children }: HeroStageProps) {
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [idle, setIdle] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const animated = !reducedMotion && !interacting && !tabHidden && slides.length > 1;

  useEffect(() => {
    if (!animated) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [animated, index, slides.length]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const markIdle = () => setIdle(true);
    // requestIdleCallback est absent de Safari : on le traite comme optionnel.
    const idleWindow: Partial<Window> = window;
    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(markIdle, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(markIdle, 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <StageContext.Provider value={{ slides, index, animated, idle, select: setIndex }}>
      <section
        className={cn("relative isolate overflow-hidden", className)}
        onPointerEnter={() => setInteracting(true)}
        onPointerLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={() => setInteracting(false)}
      >
        {children}
      </section>
    </StageContext.Provider>
  );
}

/** Photos du hero en fondu enchaîné lent + léger zoom. Ne rend rien tant qu'il n'y a pas de photo. */
export function HeroBackground() {
  const { slides, index, idle } = useStage();
  const firstImageIndex = slides.findIndex((s) => s.image);
  if (firstImageIndex === -1) return null;

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {slides.map((slide, i) => {
        if (!slide.image) return null;
        const isFirst = i === firstImageIndex;
        if (!isFirst && !idle) return null;
        return (
          <div
            key={`${slide.keyword}-${i}`}
            data-active={i === index}
            className="hero-layer absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-in-out data-[active=true]:opacity-100 motion-reduce:transition-none"
          >
            <Image
              src={slide.image.src}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              priority={isFirst}
              fetchPriority={isFirst ? "high" : "auto"}
              className="object-cover"
            />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/50 to-navy-deep/65" />
    </div>
  );
}

/** Mot rotatif de l'accroche : toutes les variantes sont dans le DOM pour moteurs et lecteurs d'écran. */
export function HeroKeyword() {
  const { slides, index } = useStage();
  return (
    <>
      <span className="sr-only">{slides.map((s) => s.keyword).join(", ")}</span>
      <span aria-hidden className="inline-grid align-bottom">
        {slides.map((slide, i) => (
          <span
            key={`${slide.keyword}-${i}`}
            data-active={i === index}
            className="col-start-1 row-start-1 transition-[opacity,transform,filter] duration-700 ease-out data-[active=false]:translate-y-3 data-[active=false]:opacity-0 data-[active=false]:blur-[6px] motion-reduce:transition-none"
          >
            {slide.keyword}
          </span>
        ))}
      </span>
    </>
  );
}

/** Indicateurs de progression cliquables (un par visuel). */
export function HeroControls({ className }: { className?: string }) {
  const { slides, index, animated, select } = useStage();
  if (slides.length < 2) return null;
  return (
    <div
      role="group"
      aria-label="Choisir le visuel affiché"
      className={cn("flex gap-1", className)}
    >
      {slides.map((slide, i) => (
        <button
          key={`${slide.keyword}-${i}`}
          type="button"
          aria-label={`Afficher : ${slide.keyword}`}
          aria-current={i === index}
          onClick={() => select(i)}
          className="group flex h-11 w-12 items-center"
        >
          <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25">
            {i === index ? (
              <span
                key={index}
                className="hero-progress absolute inset-y-0 left-0 w-full rounded-full bg-white"
                style={{
                  animationDuration: `${SLIDE_MS}ms`,
                  animationPlayState: animated ? "running" : "paused",
                }}
              />
            ) : (
              <span className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/40" />
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Étiquette de la photo affichée (« Couverture – Aix-en-Provence ») ; uniquement pour une photo réelle. */
export function HeroLabel({ className }: { className?: string }) {
  const { slides, index } = useStage();
  const label = slides[index]?.image?.location;
  if (!label) return null;
  return (
    <p
      className={cn(
        "rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur",
        className,
      )}
    >
      {label}
    </p>
  );
}
