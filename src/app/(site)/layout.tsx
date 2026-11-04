import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { AttributionCapture } from "@/components/quote/attribution-capture";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <AttributionCapture />
      {children}
    </SiteShell>
  );
}
