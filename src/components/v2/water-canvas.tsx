"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { whenIdleAfterLoad } from "@/lib/v2/after-load";
import { LANDSCAPE_QUERY, PORT_LANDSCAPE, PORT_PORTRAIT } from "@/lib/v2/sources";
import { createWaterRenderer, type WaterParams, type WaterRenderer } from "@/lib/v2/water";

interface WaterCanvasProps {
  params: WaterParams;
  className?: string;
  /** Diagnostic : images dessinées par seconde. */
  onFps?: (fps: number) => void;
}

function subscribeLandscape(callback: () => void) {
  const query = window.matchMedia(LANDSCAPE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useIsLandscape(): boolean {
  return useSyncExternalStore(
    subscribeLandscape,
    () => window.matchMedia(LANDSCAPE_QUERY).matches,
    () => false,
  );
}

/**
 * Photo du port dont l'eau bouge. La photo fixe s'affiche tout de suite (rapide, et seule version
 * pour « réduire les animations » ou si WebGL manque) ; le canvas la remplace en fondu une fois prêt.
 * Deux cadrages : paysage sur écran large, portrait sur téléphone.
 */
export function WaterCanvas({ params, className, onFps }: WaterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WaterRenderer | null>(null);
  const paramsRef = useRef(params);
  const onFpsRef = useRef(onFps);
  const [ready, setReady] = useState(false);
  const landscape = useIsLandscape();

  useEffect(() => {
    paramsRef.current = params;
    onFpsRef.current = onFps;
    rendererRef.current?.setParams(params);
  }, [params, onFps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: WaterRenderer | null = null;

    // Les vagues ne démarrent qu'une fois la page chargée et le navigateur au repos : la photo
    // fixe, le logo et le titre s'affichent d'abord, sans que la grande image de l'eau et le
    // calcul graphique leur volent la bande passante et le processeur (surtout sur téléphone).
    const cancelStart = whenIdleAfterLoad(() => {
      renderer = createWaterRenderer({
        canvas,
        source: landscape ? PORT_LANDSCAPE : PORT_PORTRAIT,
        params: paramsRef.current,
        still,
        onReady: () => setReady(true),
        onFail: () => setReady(false),
        onFps: (fps) => onFpsRef.current?.(fps),
      });
      rendererRef.current = renderer;
    });

    return () => {
      cancelStart();
      renderer?.destroy();
      rendererRef.current = null;
      setReady(false);
    };
  }, [landscape]);

  // Photo de secours : même image et même cadrage que le canvas, choisie par le navigateur sans JavaScript.
  const common = {
    alt: "",
    fill: true,
    sizes: "100vw",
    loading: "eager" as const,
    fetchPriority: "high" as const,
    style: { objectFit: "cover" as const, objectPosition: `50% ${params.focusY * 100}%` },
  };
  const wide = getImageProps({ ...common, src: PORT_LANDSCAPE.image }).props;
  const tall = getImageProps({ ...common, src: PORT_PORTRAIT.image }).props;

  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-navy-deep", className)}>
      <picture>
        <source media={LANDSCAPE_QUERY} srcSet={wide.srcSet} sizes="100vw" />
        <img {...tall} alt="" />
      </picture>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
