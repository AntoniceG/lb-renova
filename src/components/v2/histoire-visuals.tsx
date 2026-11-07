import Image from "next/image";

/**
 * Les trois visuels des bandes de l'histoire. Les images de la carte et du « 1945 » ont un fond
 * blanc : `mix-blend-multiply` le fait disparaître sur le fond crème de la bande.
 */

/**
 * Carte de l'Italie, avec le tailleur de pierre posé par-dessus la Sardaigne : la photo et la
 * carte forment un seul visuel. Tout est positionné en pourcentages du cadre de la carte
 * (1278 × 1230 px) ; le point rouge recouvre le point blanc de Pise.
 */
export function OriginesVisual() {
  return (
    <div className="relative aspect-[1278/1230] w-[min(24rem,86cqw)] lg:h-[calc(var(--band-h)*0.86)] lg:w-auto">
      <Image
        src="/v2/histoire/italie.webp"
        alt="Carte en relief de l'Italie, avec Pise repérée en Toscane"
        fill
        sizes="(max-width: 1023px) 86vw, 416px"
        className="object-contain mix-blend-multiply"
      />

      {/* Point rouge sur Pise (centre mesuré sur la carte : 33 % / 37 %). */}
      <span
        aria-hidden
        className="absolute top-[37%] left-[33%] size-[2.6%] min-h-3 min-w-3 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="histoire-dot-ring absolute inset-0 rounded-full bg-red/60" />
        <span className="absolute inset-0 rounded-full bg-red ring-2 ring-white" />
      </span>

      {/* Le tailleur de pierre, posé sur la Sardaigne comme une photo épinglée sur la carte. */}
      <div className="histoire-portrait absolute top-[44%] left-[1%] w-[38%] shadow-[0_18px_36px_-12px_rgba(0,0,0,0.55)]">
        <Image
          src="/v2/histoire/tailleur.webp"
          alt="Tailleur de pierre toscan tenant un maillet et un ciseau, photographie ancienne"
          width={720}
          height={960}
          sizes="(max-width: 1023px) 30vw, 150px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

/** « 1945 » en grandes capitales classiques. */
export function MarseilleVisual() {
  return (
    <div className="relative aspect-[3/1] w-[min(24rem,80cqw)] lg:w-[min(28rem,34cqw)]">
      <Image
        src="/v2/histoire/annee-1945.webp"
        alt="1945"
        fill
        sizes="(max-width: 1023px) 80vw, 480px"
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
}

/** Léon Bracaloni aujourd'hui : la photo remplit tout l'espace de l'image. */
export function AujourdhuiVisual() {
  return (
    <>
      <Image
        src="/v2/histoire/leon-hd.webp"
        alt="Léon Bracaloni aux commandes d'une mini-pelle sur un chantier de terrassement"
        fill
        sizes="(max-width: 1023px) 100vw, 60vw"
        className="object-cover object-[50%_44%]"
      />
      <p className="absolute bottom-4 left-4 bg-navy-deep/80 px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm md:bottom-6 md:left-6">
        Léon Bracaloni
      </p>
    </>
  );
}
