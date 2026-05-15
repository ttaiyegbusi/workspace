import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border)] mb-5">
          <Icon
            size={22}
            strokeWidth={1.4}
            className="text-[var(--text-muted)]"
          />
        </div>
        <h2 className="text-[15px] font-medium mb-1.5">{title}</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
        <div className="mt-6 text-[10px] tracking-[0.18em] text-[var(--text-subtle)]">
          COMING SOON
        </div>
      </div>
    </div>
  );
}
