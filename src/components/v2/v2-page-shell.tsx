import type { ReactNode } from "react";
import { V2Footer } from "./v2-footer";
import { V2Header } from "./v2-header";

/** Cadre des pages intérieures de la refonte : en-tête toujours visible, contenu, pied de page. */
export function V2PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <V2Header variant="page" />
      <main>{children}</main>
      <V2Footer />
    </>
  );
}
