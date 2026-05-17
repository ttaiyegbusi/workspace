import type { DocFileType } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<DocFileType, string> = {
  pdf: "PDF",
  xls: "XLS",
  fig: "FIG",
  audio: "♪",
  doc: "DOC",
  img: "IMG",
  zip: "ZIP",
};

const colors: Record<DocFileType, string> = {
  pdf: "text-[#c54545]",
  xls: "text-[#2e7d4a]",
  fig: "text-[#a04ad4]",
  audio: "text-[#d44a9a]",
  doc: "text-[#3568b8]",
  img: "text-[#c98a2e]",
  zip: "text-[#7a7a7a]",
};

export function DocIcon({
  type,
  size = "sm",
}: {
  type: DocFileType;
  /** "sm" = 8x10 inline icon, "lg" = ~64px faint centerpiece for grid tiles */
  size?: "sm" | "lg";
}) {
  if (size === "lg") {
    return (
      <span className="relative inline-flex items-center justify-center w-14 h-[68px] opacity-30">
        <svg
          viewBox="0 0 28 36"
          className="absolute inset-0 w-full h-full text-[var(--border-strong)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M2.5 1.5h17l6 6v27a1 1 0 0 1-1 1h-22a1 1 0 0 1-1-1v-32a1 1 0 0 1 1-1Z" />
          <path d="M19.5 1.5v6h6" />
        </svg>
        <span
          className={cn(
            "relative text-[13px] font-semibold tracking-tight mt-3",
            colors[type],
          )}
        >
          {labels[type]}
        </span>
      </span>
    );
  }
  return (
    <span className="relative inline-flex items-center justify-center w-8 h-10 flex-shrink-0">
      <svg
        viewBox="0 0 28 36"
        className="absolute inset-0 w-full h-full text-[var(--border-strong)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path d="M2.5 1.5h17l6 6v27a1 1 0 0 1-1 1h-22a1 1 0 0 1-1-1v-32a1 1 0 0 1 1-1Z" />
        <path d="M19.5 1.5v6h6" />
      </svg>
      <span
        className={cn(
          "relative text-[8px] font-semibold tracking-tight mt-2",
          colors[type],
        )}
      >
        {labels[type]}
      </span>
    </span>
  );
}
