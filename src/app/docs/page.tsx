"use client";

import { useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { DocIcon } from "@/components/doc-icon";
import { DocMenu } from "@/components/doc-menu";
import { docs } from "@/data/docs";
import { formatDate, cn } from "@/lib/utils";
import { useLocalStoragePref } from "@/lib/use-local-storage-pref";
import type { DocItem } from "@/lib/types";

type ViewMode = "list" | "grid";

export default function DocsPage() {
  const [view, setView] = useLocalStoragePref<ViewMode>("docs-view", "list");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <TopBar title="Documents" />

      {/* Tab strip + view toggle */}
      <div className="px-5 md:px-8 border-b border-[var(--border)] flex items-center">
        <button
          className={cn(
            "py-3 text-[13px] border-b-2 -mb-[1px] whitespace-nowrap",
            "border-[var(--text)] text-[var(--text)] font-medium",
          )}
        >
          All{" "}
          <span className="text-[var(--text-subtle)] text-xs ml-1">
            [ {docs.length} ]
          </span>
        </button>

        <div className="ml-auto flex items-center gap-1 py-2">
          <ViewToggleBtn
            active={view === "list"}
            onClick={() => setView("list")}
            label="List view"
          >
            <List size={14} />
          </ViewToggleBtn>
          <ViewToggleBtn
            active={view === "grid"}
            onClick={() => setView("grid")}
            label="Grid view"
          >
            <LayoutGrid size={14} />
          </ViewToggleBtn>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin">
        {view === "list" ? (
          <ListView docs={docs} selected={selected} onToggle={toggle} />
        ) : (
          <GridView docs={docs} selected={selected} onToggle={toggle} />
        )}
      </div>
    </>
  );
}

// ---------- View toggle button ----------

function ViewToggleBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded transition-colors",
        active
          ? "bg-[var(--surface-2)] text-[var(--text)]"
          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover)]",
      )}
    >
      {children}
    </button>
  );
}

// ---------- List view ----------

function ListView({
  docs,
  selected,
  onToggle,
}: {
  docs: DocItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <ul>
      {docs.map((d) => {
        const isSelected = selected.has(d.id);
        return (
          <li
            key={d.id}
            className={cn(
              "px-5 md:px-8 py-3 flex items-center gap-3 md:gap-4 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer",
              isSelected && "bg-[var(--selected)]",
            )}
            onClick={() => onToggle(d.id)}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(d.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-3.5 w-3.5 accent-[var(--text)] flex-shrink-0"
              aria-label={`Select ${d.name}`}
            />
            <DocIcon type={d.type} />
            <span className="text-[13px] flex-1 min-w-0 truncate">{d.name}</span>
            <span className="hidden sm:block text-[13px] text-[var(--text-muted)] w-[80px] tabular-nums">
              {d.size}
            </span>
            <span className="hidden md:block text-[13px] text-[var(--text-muted)] w-[200px] text-right truncate">
              Uploaded {formatDate(d.uploadedAt)}
            </span>
            <DocMenu align="right" size="md" />
          </li>
        );
      })}
    </ul>
  );
}

// ---------- Grid view ----------

function GridView({
  docs,
  selected,
  onToggle,
}: {
  docs: DocItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="px-5 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {docs.map((d) => {
        const isSelected = selected.has(d.id);
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onToggle(d.id)}
            className={cn(
              "group relative flex flex-col text-left rounded-md border bg-[var(--surface)] hover:bg-[var(--hover)] transition-colors min-h-[200px] overflow-hidden",
              isSelected
                ? "border-[var(--text)] ring-1 ring-[var(--text)]"
                : "border-[var(--border)]",
            )}
          >
            {/* Top row: checkbox + file type label + ⋮ */}
            <div className="px-3 pt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(d.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-3.5 w-3.5 accent-[var(--text)]"
                aria-label={`Select ${d.name}`}
              />
              <span className="text-[10px] tracking-[0.08em] font-medium text-[var(--text-muted)] uppercase">
                {d.type}
              </span>
              <div
                className="ml-auto"
                // Stop the trigger click from also toggling the tile selection
                onClick={(e) => e.stopPropagation()}
              >
                <DocMenu align="right" size="sm" />
              </div>
            </div>

            {/* Faint centerpiece icon */}
            <div className="flex-1 flex items-center justify-center px-3 py-4">
              <DocIcon type={d.type} size="lg" />
            </div>

            {/* Bottom: name + meta */}
            <div className="px-3 pb-3 border-t border-[var(--border)] pt-2.5">
              <div className="text-[13px] font-medium truncate">{d.name}</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                {d.size} <span className="text-[var(--text-subtle)]">·</span>{" "}
                Uploaded {formatDate(d.uploadedAt)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
