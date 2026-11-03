import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Logotype provisoire construit depuis le nom de la marque (première partie en italique gras).
 * À remplacer par le logo final (SVG) quand il sera livré.
 */
export function Logo({ name, tone = "dark", className }: LogoProps) {
  const [first = name, ...rest] = name.split(" ");
  const second = rest.join(" ");
  return (
    <Link
      href="/"
      aria-label={`${name} — accueil`}
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display text-2xl leading-none font-extrabold tracking-tight",
        tone === "dark" ? "text-navy" : "text-white",
        className,
      )}
    >
      <span className="italic">{first}</span>
      {second && <span className={tone === "dark" ? "text-red-ink" : "text-white"}>{second}</span>}
    </Link>
  );
}
