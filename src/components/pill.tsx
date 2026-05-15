import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "outline";
  className?: string;
};

export function Pill({ children, variant = "outline", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-xs whitespace-nowrap",
        variant === "outline"
          ? "border border-[var(--border-strong)] text-[var(--text-muted)]"
          : "bg-[var(--pill-bg)] text-[var(--pill-text)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
