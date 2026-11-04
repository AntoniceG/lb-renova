"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Mémorise l'origine de la visite (campagne, référent) pour la joindre au devis. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
