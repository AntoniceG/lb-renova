"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Photo } from "@/lib/v2/realisations";
import { PhotoImage } from "./photo-image";

interface AlbumGalleryProps {
  photos: readonly Photo[];
  /** Nom de l'album, pour l'étiquette des boutons (« Agrandir la photo … »). */
  album: string;
}

/**
 * Album photo : une mosaïque de vignettes ; un clic ouvre la photo en grand dans une fenêtre
 * (balise <dialog>, qui gère toute seule le clavier : Échap ferme, Tab reste dans la fenêtre).
 * Flèches gauche/droite pour passer d'une photo à l'autre.
 */
export function AlbumGallery({ photos, album }: AlbumGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current !== null && !dialog.open) dialog.showModal();
    if (current === null && dialog.open) dialog.close();
  }, [current]);

  const total = photos.length;
  const photo = current === null ? undefined : photos[current];
  const go = (step: number) =>
    setCurrent((index) => (index === null ? index : (index + step + total) % total));

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4">
        {photos.map((item, index) => (
          <li key={item.number} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Agrandir la photo ${index + 1} sur ${total} : ${item.alt}`}
              className="group block w-full overflow-hidden bg-navy/5 focus-visible:outline-blue"
            >
              <PhotoImage
                photo={item}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 380px"
                // Les premières vignettes sont visibles dès l'ouverture : pas de chargement différé.
                loading={index < 4 ? "eager" : "lazy"}
                className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`Photos : ${album}`}
        onClose={() => setCurrent(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          // Un clic sur le fond (hors photo et hors boutons) ferme la fenêtre.
          if (event.target === event.currentTarget) setCurrent(null);
        }}
        className="m-0 size-full max-h-none max-w-none bg-navy-deep/95 p-0 text-white backdrop:bg-black/80"
      >
        {photo && (
          <div className="flex size-full flex-col items-center justify-center gap-4 p-4 md:p-10">
            <button
              type="button"
              onClick={() => setCurrent(null)}
              aria-label="Fermer"
              className="absolute top-4 right-4 inline-flex size-12 items-center justify-center text-white focus-visible:outline-white md:top-6 md:right-6"
            >
              <X aria-hidden className="size-8" />
            </button>

            <PhotoImage
              key={photo.src}
              photo={photo}
              sizes="100vw"
              className="block max-h-[78svh] w-auto max-w-full object-contain"
            />

            <p className="text-center text-sm text-white/80" aria-live="polite">
              {photo.alt}
              <span className="ml-3 text-white/55">
                {current === null ? "" : current + 1} / {total}
              </span>
            </p>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Photo précédente"
                  className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center text-white focus-visible:outline-white md:left-6"
                >
                  <ChevronLeft aria-hidden className="size-9" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Photo suivante"
                  className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center text-white focus-visible:outline-white md:right-6"
                >
                  <ChevronRight aria-hidden className="size-9" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
