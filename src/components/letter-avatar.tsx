import { cn } from "@/lib/utils";
import { getContrast } from "@/data/team-colors";

type Props = {
  letter: string;
  size?: "xs" | "sm" | "md" | "lg";
  filled?: boolean;
  /** Custom background color (e.g. a team's chosen color). Overrides `filled` defaults. */
  color?: string;
  className?: string;
};

const sizeMap = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-6 w-6 text-[11px]",
  md: "h-7 w-7 text-xs",
  lg: "h-9 w-9 text-sm",
};

export function LetterAvatar({
  letter,
  size = "sm",
  filled = false,
  color,
  className,
}: Props) {
  // When a custom color is provided, render with inline styles so the swatch
  // shows through both light and dark mode unaltered.
  const inlineStyle = color
    ? { backgroundColor: color, color: getContrast(color) ?? "#fff" }
    : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[3px] font-medium select-none flex-shrink-0",
        sizeMap[size],
        // Only apply default classes if no explicit color was given
        !color &&
          (filled
            ? "bg-[var(--text)] text-[var(--surface)]"
            : "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]"),
        className,
      )}
      style={inlineStyle}
      aria-hidden
    >
      {letter}
    </span>
  );
}
