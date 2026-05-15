import { cn } from "@/lib/utils";

type Props = {
  letter: string;
  size?: "xs" | "sm" | "md" | "lg";
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
  className,
  style,
}: Props) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center justify-center rounded-[3px] font-medium select-none flex-shrink-0",
        sizeMap[size],
        filled
          ? "bg-[var(--text)] text-[var(--surface)]"
          : "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]",
        className,
      )}
      aria-hidden
    >
      {letter}
    </span>
  );
}
