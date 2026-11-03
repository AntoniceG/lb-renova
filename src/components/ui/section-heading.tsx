import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "light",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow", tone === "dark" && "text-white/70")}>{eyebrow}</p>
      <h2 id={id} className={cn("mt-4 text-title", tone === "dark" ? "text-white" : "text-navy")}>
        {title}
      </h2>
      {children && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            tone === "dark" ? "text-white/80" : "text-muted",
          )}
        >
          {children}
        </p>
      )}
    </div>
  );
}
