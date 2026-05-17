"use client";

import { useEffect, useRef, useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { DocIcon } from "@/components/doc-icon";
import { DocMenu } from "@/components/doc-menu";
import { docs as seedDocs } from "@/data/docs";
import { formatDate, cn } from "@/lib/utils";
import { useLocalStoragePref } from "@/lib/use-local-storage-pref";
import { useStore } from "@/lib/store";
import { useToastStore } from "@/components/toast";
import type { DocItem } from "@/lib/types";

type ViewMode = "list" | "grid";

export default function DocsPage() {
  const [view, setView] = useLocalStoragePref<ViewMode>("docs-view", "list");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);

  // Pull stable references from the store (never derive in a selector)
  const deletedDocIds = useStore((s) => s.deletedDocIds);
  const docNameOverrides = useStore((s) => s.docNameOverrides);
  const deleteDoc = useStore((s) => s.deleteDoc);
  const restoreDoc = useStore((s) => s.restoreDoc);
  const renameDoc = useStore((s) => s.renameDoc);
  const showToast = useToastStore((s) => s.show);

  // Apply user mutations on top of the seed docs
  const deletedSet = new Set(deletedDocIds);
  const visibleDocs: DocItem[] = seedDocs
    .filter((d) => !deletedSet.has(d.id))
    .map((d) =>
      docNameOverrides[d.id] ? { ...d, name: docNameOverrides[d.id]! } : d,
    );

  function toggle(id: string) {
    if (renamingId === id) return; // don't toggle selection while renaming
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ----- Actions wired from the DocMenu -----

  function handleDownload(doc: DocItem) {
    showToast({
      message: `Downloaded ${doc.name}`,
      duration: 4000,
    });
  }

  function handleRename(doc: DocItem) {
    setRenamingId(doc.id);
  }

  function commitRename(doc: DocItem, newName: string) {
    const trimmed = newName.trim();
    setRenamingId(null);
    if (!trimmed || trimmed === doc.name) return;
    renameDoc(doc.id, trimmed);
    showToast({
      message: `Renamed to ${trimmed}`,
      duration: 3000,
    });
  }

  function handleDelete(doc: DocItem) {
    deleteDoc(doc.id);
    // Also drop it from selection if it was selected
    setSelected((s) => {
      if (!s.has(doc.id)) return s;
      const next = new Set(s);
      next.delete(doc.id);
      return next;
    });
    showToast({
      message: `Deleted ${doc.name}`,
      duration: 5000,
      actions: [
        {
          label: "Undo",
          onClick: () => restoreDoc(doc.id),
        },
      ],
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
            [ {visibleDocs.length} ]
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
          <ListView
            docs={visibleDocs}
            selected={selected}
            onToggle={toggle}
            renamingId={renamingId}
            onCommitRename={commitRename}
            onCancelRename={() => setRenamingId(null)}
            onDownload={handleDownload}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ) : (
          <GridView
            docs={visibleDocs}
            selected={selected}
            onToggle={toggle}
            renamingId={renamingId}
            onCommitRename={commitRename}
            onCancelRename={() => setRenamingId(null)}
            onDownload={handleDownload}
            onRename={handleRename}
            onDelete={handleDelete}
          />
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

// ---------- Inline rename input ----------

function RenameInput({
  initialValue,
  onCommit,
  onCancel,
  size = "list",
}: {
  initialValue: string;
  onCommit: (next: string) => void;
  onCancel: () => void;
  size?: "list" | "grid";
}) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onCommit(value);
        }
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      // Blur commits (clicking outside the input commits the rename)
      onBlur={() => onCommit(value)}
      onClick={(e) => e.stopPropagation()}
      maxLength={100}
      className={cn(
        "bg-transparent border border-[var(--border-strong)] rounded outline-none focus:outline-none focus:ring-0 -my-0.5",
        size === "list"
          ? "h-7 px-2 text-[13px] flex-1 min-w-0"
          : "h-7 px-2 text-[13px] font-medium w-full",
      )}
    />
  );
}

// ---------- List view ----------

type ViewProps = {
  docs: DocItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  renamingId: string | null;
  onCommitRename: (doc: DocItem, name: string) => void;
  onCancelRename: () => void;
  onDownload: (doc: DocItem) => void;
  onRename: (doc: DocItem) => void;
  onDelete: (doc: DocItem) => void;
};

function ListView({
  docs,
  selected,
  onToggle,
  renamingId,
  onCommitRename,
  onCancelRename,
  onDownload,
  onRename,
  onDelete,
}: ViewProps) {
  return (
    <ul>
      {docs.map((d) => {
        const isSelected = selected.has(d.id);
        const isRenaming = renamingId === d.id;
        return (
          <li
            key={d.id}
            className={cn(
              "px-5 md:px-8 py-3 flex items-center gap-3 md:gap-4 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors",
              isSelected && "bg-[var(--selected)]",
              !isRenaming && "cursor-pointer",
            )}
            onClick={() => !isRenaming && onToggle(d.id)}
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
            {isRenaming ? (
              <RenameInput
                initialValue={d.name}
                onCommit={(name) => onCommitRename(d, name)}
                onCancel={onCancelRename}
                size="list"
              />
            ) : (
              <span className="text-[13px] flex-1 min-w-0 truncate">
                {d.name}
              </span>
            )}
            <span className="hidden sm:block text-[13px] text-[var(--text-muted)] w-[80px] tabular-nums">
              {d.size}
            </span>
            <span className="hidden md:block text-[13px] text-[var(--text-muted)] w-[200px] text-right truncate">
              Uploaded {formatDate(d.uploadedAt)}
            </span>
            <DocMenu
              align="right"
              size="md"
              onDownload={() => onDownload(d)}
              onRename={() => onRename(d)}
              onDelete={() => onDelete(d)}
            />
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
  renamingId,
  onCommitRename,
  onCancelRename,
  onDownload,
  onRename,
  onDelete,
}: ViewProps) {
  return (
    <div className="px-5 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {docs.map((d) => {
        const isSelected = selected.has(d.id);
        const isRenaming = renamingId === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => !isRenaming && onToggle(d.id)}
            className={cn(
              "group relative flex flex-col text-left rounded-md border bg-[var(--surface)] hover:bg-[var(--hover)] transition-colors min-h-[260px] overflow-hidden",
              isSelected
                ? "border-[var(--text)] ring-1 ring-[var(--text)]"
                : "border-[var(--border)]",
            )}
          >
            {/* Top row */}
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
              <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                <DocMenu
                  align="right"
                  size="sm"
                  onDownload={() => onDownload(d)}
                  onRename={() => onRename(d)}
                  onDelete={() => onDelete(d)}
                />
              </div>
            </div>

            {/* Faint centerpiece icon — no divider above the bottom section */}
            <div className="flex-1 flex items-center justify-center px-3 py-6">
              <DocIcon type={d.type} size="lg" />
            </div>

            {/* Bottom: name + meta (no divider) */}
            <div className="px-3 pb-3 pt-1">
              {isRenaming ? (
                <RenameInput
                  initialValue={d.name}
                  onCommit={(name) => onCommitRename(d, name)}
                  onCancel={onCancelRename}
                  size="grid"
                />
              ) : (
                <div className="text-[13px] font-medium truncate">{d.name}</div>
              )}
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
