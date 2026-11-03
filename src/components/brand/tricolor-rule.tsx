import { cn } from "@/lib/utils";

/** Liseré bleu / blanc / rouge, purement décoratif. */
export function TricolorRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-1 w-full", className)}>
      <span className="flex-1 bg-navy" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-red" />
    </div>
  );
}
