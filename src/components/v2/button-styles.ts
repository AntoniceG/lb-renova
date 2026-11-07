import { cva } from "class-variance-authority";

/**
 * Boutons de la refonte V2 : petites majuscules espacées, jamais de gros aplat rouge.
 * `light` = blanc plein et `glass` = verre dépoli (sur photo ou fond marine) ;
 * `navy` = bleu marine plein (sur fond clair).
 */
export const v2Button = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition-[background-color,border-color,box-shadow,transform] duration-300 active:translate-y-px",
  {
    variants: {
      tone: {
        light:
          "bg-white text-navy shadow-[0_14px_34px_-14px_rgba(0,0,0,0.6)] hover:bg-sky focus-visible:outline-white",
        glass:
          "border border-white/55 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 focus-visible:outline-white",
        navy: "bg-navy text-white shadow-[0_14px_30px_-14px_oklch(0.27_0.07_262/0.7)] hover:bg-navy-deep focus-visible:outline-blue",
      },
      size: {
        default: "min-h-12 px-8 text-[0.8rem]",
        compact: "min-h-10 px-5 text-[0.72rem] tracking-[0.14em]",
      },
    },
    defaultVariants: { tone: "light", size: "default" },
  },
);
