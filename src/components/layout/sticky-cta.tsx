"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 400;

interface StickyCtaProps {
  quote: { label: string; href: string };
  call: { label: string; href: string };
}

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/** Une modale ouverte pose `data-modal-open` sur <html> ; la barre se masque alors. */
function subscribeModal(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-modal-open"],
  });
  return () => observer.disconnect();
}

/** Barre d'actions mobile : visible après un scroll, masquée dans le footer et sous une modale. */
export function StickyCta({ quote, call }: StickyCtaProps) {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > SHOW_AFTER_PX,
    () => false,
  );
  const modalOpen = useSyncExternalStore(
    subscribeModal,
    () => document.documentElement.hasAttribute("data-modal-open"),
    () => false,
  );
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry?.isIntersecting ?? false);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = scrolled && !footerVisible && !modalOpen;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none md:hidden",
        visible ? "translate-y-0 shadow-[0_-12px_32px_-16px_rgba(0,0,0,0.25)]" : "translate-y-full",
      )}
    >
      <div className="flex gap-2">
        <Button variant="cta" size="lg" asChild className="flex-1">
          <Link href={quote.href}>{quote.label}</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href={call.href} aria-label={call.label}>
            <Phone aria-hidden className="size-5" />
            <span className="sr-only sm:not-sr-only">{call.label}</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
