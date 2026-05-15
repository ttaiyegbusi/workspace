import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  Low: "border-[var(--border-strong)] text-[var(--text-muted)]",
  Medium: "border-[var(--border-strong)] text-[var(--text-muted)]",
  High: "border-[var(--border-strong)] text-[var(--text)]",
  Urgent: "border-[var(--danger)] text-[var(--danger)]",
};

export function PriorityPill({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[3px] text-xs border whitespace-nowrap",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}
