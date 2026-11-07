import type { Metadata } from "next";
import { WaterLab } from "@/components/v2/water-lab";

// Banc d'essai interne de la refonte : jamais indexé, même en production.
export const metadata: Metadata = {
  title: "Banc d'essai — l'eau du port",
  robots: { index: false, follow: false },
};

export default function WaterLabPage() {
  return <WaterLab />;
}
