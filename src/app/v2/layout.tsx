import { DM_Sans, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./v2.css";

// Polices de la refonte (celles de bvrrenovation.fr). Chargées uniquement sur les pages /v2.
const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const text = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function V2Layout({ children }: { children: ReactNode }) {
  return <div className={`${display.variable} ${text.variable} font-v2-sans`}>{children}</div>;
}
