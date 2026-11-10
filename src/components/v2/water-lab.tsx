"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { HERO_LOOK } from "@/lib/v2/hero-look";
import { DEFAULT_WATER_PARAMS, type WaterParams } from "@/lib/v2/water";
import { v2Button } from "./button-styles";
import { WaterCanvas } from "./water-canvas";
import { WaterVeil } from "./water-veil";

type NumericKey = Exclude<keyof WaterParams, "showMask">;

const SLIDERS: { key: NumericKey; label: string; min: number; max: number; step: number }[] = [
  { key: "amplitude", label: "Hauteur des vagues", min: 0, max: 3, step: 0.05 },
  { key: "speed", label: "Vitesse", min: 0, max: 3, step: 0.05 },
  { key: "fineness", label: "Finesse des vagues", min: 0.3, max: 3, step: 0.05 },
  { key: "pointer", label: "Force de la souris", min: 0, max: 3, step: 0.05 },
  { key: "focusY", label: "Cadrage vertical (écran large)", min: 0, max: 1, step: 0.01 },
];

/** Évite que le réglage des curseurs fasse onduler l'eau en dessous. */
const stop = (event: PointerEvent) => event.stopPropagation();

const DEFAULT_VEIL = HERO_LOOK.veil;
const DEFAULT_WARMTH = HERO_LOOK.warmth;

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="grid gap-1">
      <span className="flex justify-between">
        {label}
        <output className="font-mono text-white/70">{value.toFixed(2)}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-white"
      />
    </label>
  );
}

/** Banc d'essai de l'eau : curseurs de réglage + aperçu de la composition (logo, voile, boutons). */
export function WaterLab() {
  const [params, setParams] = useState<WaterParams>(DEFAULT_WATER_PARAMS);
  const [veil, setVeil] = useState(DEFAULT_VEIL);
  const [warmth, setWarmth] = useState(DEFAULT_WARMTH);
  const [showLogo, setShowLogo] = useState(true);
  const [fps, setFps] = useState<number | null>(null);
  const panelRef = useRef<HTMLDetailsElement>(null);

  // Ouvert d'office sur grand écran ; replié sur téléphone pour ne pas cacher la photo.
  useEffect(() => {
    if (panelRef.current && window.matchMedia("(min-width: 640px)").matches) {
      panelRef.current.open = true;
    }
  }, []);

  return (
    <main className="relative h-svh w-full overflow-hidden bg-navy-deep text-white">
      <WaterCanvas params={params} onFps={setFps} />

      <WaterVeil veil={veil} warmth={warmth} />

      {showLogo && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-7 px-4 pb-16">
          <Image
            src="/v2/logo-20ans.webp"
            alt="LB Rénova — de père en fils depuis 1945"
            width={887}
            height={887}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 70vw, 380px"
            className="w-[min(70vw,24rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          />
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <span className={v2Button({ tone: "light" })}>Devis gratuit</span>
            <span className={v2Button({ tone: "glass" })}>
              <Phone aria-hidden className="size-4" />
              Appeler
            </span>
          </div>
        </div>
      )}

      <details
        ref={panelRef}
        onPointerMove={stop}
        onPointerDown={stop}
        className="absolute bottom-3 left-3 z-10 max-h-[70svh] w-[min(22rem,calc(100vw-1.5rem))] overflow-auto rounded-2xl border border-white/20 bg-navy-deep/85 p-4 text-sm shadow-elevated backdrop-blur-md"
      >
        <summary className="cursor-pointer font-v2-display text-lg font-semibold">
          Réglages de l&apos;eau
        </summary>

        <div className="mt-4 grid gap-3.5">
          {SLIDERS.map(({ key, label, min, max, step }) => (
            <Slider
              key={key}
              label={label}
              value={params[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => setParams({ ...params, [key]: value })}
            />
          ))}

          <Slider
            label="Voile marine sur la photo"
            value={veil}
            min={0}
            max={0.7}
            step={0.01}
            onChange={setVeil}
          />
          <Slider
            label="Chaleur du voile (doré)"
            value={warmth}
            min={0}
            max={1}
            step={0.01}
            onChange={setWarmth}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.showMask}
              onChange={(event) => setParams({ ...params, showMask: event.target.checked })}
            />
            Colorer en rouge la zone qui bouge
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLogo}
              onChange={(event) => setShowLogo(event.target.checked)}
            />
            Aperçu du logo et des boutons
          </label>

          <button
            type="button"
            onClick={() => {
              setParams(DEFAULT_WATER_PARAMS);
              setVeil(DEFAULT_VEIL);
              setWarmth(DEFAULT_WARMTH);
            }}
            className="justify-self-start rounded-full border border-white/40 px-4 py-2 font-semibold hover:bg-white/10"
          >
            Réinitialiser
          </button>

          <p className="text-xs text-white/70">
            Animation :{" "}
            {fps === null ? "pas encore démarrée" : `${fps} images par seconde (60 = fluide)`}
          </p>

          <p className="rounded-lg bg-black/30 p-2 font-mono text-xs break-all text-white/70 select-all">
            {JSON.stringify({ ...params, veil, warmth })}
          </p>
        </div>
      </details>
    </main>
  );
}
