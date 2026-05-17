"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  ExternalLink,
  Download,
  Pencil,
  FolderInput,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** A trigger + dropdown menu for a single document's actions. Stub-only. */
export function DocMenu({
  align = "right",
  size = "md",
}: {
  /** Where the menu opens relative to the trigger. */
  align?: "left" | "right";
  /** Size of the trigger icon-button. */
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Document actions"
        className={cn(
          "flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
          size === "sm" ? "h-6 w-6" : "h-7 w-7",
        )}
      >
        <MoreVertical size={size === "sm" ? 12 : 13} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-30 w-[170px] rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] py-1",
            align === "right" ? "right-0" : "left-0",
          )}
          // Stop clicks inside the menu from bubbling up to a parent <Link> or row click
          onClick={(e) => e.stopPropagation()}
        >
          <Item icon={ExternalLink} label="Open" onClick={() => setOpen(false)} />
          <Item
            icon={Download}
            label="Download"
            onClick={() => setOpen(false)}
          />
          <Item icon={Pencil} label="Rename" onClick={() => setOpen(false)} />
          <Item
            icon={FolderInput}
            label="Move to folder"
            onClick={() => setOpen(false)}
          />
          <div className="h-px bg-[var(--border)] mx-2 my-1" />
          <Item
            icon={Trash2}
            label="Delete"
            destructive
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: typeof MoreVertical;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-2.5 h-8 flex items-center gap-2 text-sm hover:bg-[var(--hover)] text-left",
        destructive ? "text-[var(--danger,#dc2626)]" : "text-[var(--text)]",
      )}
    >
      <Icon
        size={13}
        className={cn(
          destructive
            ? "text-[var(--danger,#dc2626)]"
            : "text-[var(--text-muted)]",
        )}
        strokeWidth={1.6}
      />
      <span>{label}</span>
    </button>
  );
}
