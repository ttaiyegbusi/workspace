"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Paperclip, ExternalLink } from "lucide-react";
import { LetterAvatar } from "@/components/letter-avatar";
import { DocIcon } from "@/components/doc-icon";
import { useStore } from "@/lib/store";
import { contacts } from "@/data/contacts";
import { docs } from "@/data/docs";
import { links } from "@/data/links";
import { cn } from "@/lib/utils";

type Filter = "contact" | "documents" | "links" | "teams";
const ALL_FILTERS: Filter[] = ["contact", "documents", "links", "teams"];

const filterLabels: Record<Filter, string> = {
  contact: "Contact",
  documents: "Documents",
  links: "Links",
  teams: "Teams",
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchPopover({ open, onClose }: Props) {
  const router = useRouter();
  const teams = useStore((s) => s.teams);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(
    new Set(ALL_FILTERS),
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveFilters(new Set(ALL_FILTERS));
      setDismissed(new Set());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setDismissed(new Set());
  }, [query]);

  // Outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-search-trigger]")
      ) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function dismiss(key: string) {
    setDismissed((s) => new Set(s).add(key));
  }

  function toggleFilter(f: Filter) {
    setActiveFilters((s) => {
      const next = new Set(s);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  function removeFilter(f: Filter) {
    setActiveFilters((s) => {
      const next = new Set(s);
      next.delete(f);
      return next;
    });
  }

  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const contactResults = useMemo(() => {
    if (!activeFilters.has("contact") || !hasQuery) return [];
    return contacts.filter(
      (c) =>
        !dismissed.has(`contact:${c.id}`) &&
        (c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)),
    );
  }, [activeFilters, q, hasQuery, dismissed]);

  const docResults = useMemo(() => {
    if (!activeFilters.has("documents") || !hasQuery) return [];
    return docs.filter(
      (d) =>
        !dismissed.has(`doc:${d.id}`) && d.name.toLowerCase().includes(q),
    );
  }, [activeFilters, q, hasQuery, dismissed]);

  const linkResults = useMemo(() => {
    if (!activeFilters.has("links") || !hasQuery) return [];
    return links.filter(
      (l) =>
        !dismissed.has(`link:${l.id}`) && l.url.toLowerCase().includes(q),
    );
  }, [activeFilters, q, hasQuery, dismissed]);

  const teamResults = useMemo(() => {
    if (!activeFilters.has("teams") || !hasQuery) return [];
    return teams.filter(
      (t) =>
        !dismissed.has(`team:${t.id}`) && t.name.toLowerCase().includes(q),
    );
  }, [activeFilters, q, hasQuery, dismissed, teams]);

  const totalResults =
    contactResults.length +
    docResults.length +
    linkResults.length +
    teamResults.length;

  function go(href: string) {
    onClose();
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-12 right-3 md:right-4 z-50 w-[420px] max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-5rem)] bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-[var(--shadow-lg)] flex flex-col overflow-hidden"
    >
      {/* Search input */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
        <Search size={14} className="text-[var(--text-subtle)] flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything — contacts, docs, links, teams…"
          className="flex-1 h-7 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[14px] placeholder:text-[var(--text-subtle)]"
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-strong)] text-[var(--text-subtle)]">
          ESC
        </kbd>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-1.5 border-b border-[var(--border)]">
        {ALL_FILTERS.map((f) => {
          const active = activeFilters.has(f);
          return (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-xs border transition-colors",
                active
                  ? "border-[var(--border-strong)] text-[var(--text)] bg-[var(--surface-2)]"
                  : "border-[var(--border)] text-[var(--text-subtle)] hover:text-[var(--text-muted)]",
              )}
            >
              <span>{filterLabels[f]}</span>
              {active && (
                <span
                  role="button"
                  aria-label={`Remove ${filterLabels[f]} filter`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(f);
                  }}
                  className="-mr-0.5 h-3.5 w-3.5 inline-flex items-center justify-center rounded-sm hover:bg-[var(--hover)]"
                >
                  <X size={9} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="max-h-[55vh] overflow-y-auto scroll-thin">
        {!hasQuery ? (
          <EmptyHint />
        ) : totalResults === 0 ? (
          <div className="px-4 py-10 text-center text-xs text-[var(--text-subtle)]">
            No results for &ldquo;{query}&rdquo;
            {activeFilters.size < ALL_FILTERS.length &&
              " — try enabling more filters."}
          </div>
        ) : (
          <>
            {contactResults.length > 0 && (
              <Section label="Contact" count={contactResults.length}>
                {contactResults.map((c) => (
                  <ResultRow
                    key={c.id}
                    onClick={() => go("/search")}
                    onDismiss={() => dismiss(`contact:${c.id}`)}
                    leading={
                      <LetterAvatar
                        letter={c.name.charAt(0).toUpperCase()}
                        size="sm"
                      />
                    }
                    title={c.name}
                    sub={c.email}
                  />
                ))}
              </Section>
            )}

            {docResults.length > 0 && (
              <Section label="Documents" count={docResults.length}>
                {docResults.map((d) => (
                  <ResultRow
                    key={d.id}
                    onClick={() => go("/docs")}
                    onDismiss={() => dismiss(`doc:${d.id}`)}
                    leading={<DocIcon type={d.type} />}
                    title={d.name}
                    sub={`in Documents • Edited ${d.size}`}
                  />
                ))}
              </Section>
            )}

            {linkResults.length > 0 && (
              <Section label="Links" count={linkResults.length}>
                {linkResults.map((l) => (
                  <ResultRow
                    key={l.id}
                    onClick={() => go("/search")}
                    onDismiss={() => dismiss(`link:${l.id}`)}
                    leading={
                      <Paperclip
                        size={13}
                        className="text-[var(--text-muted)] mt-0.5"
                      />
                    }
                    title={l.url}
                  />
                ))}
              </Section>
            )}

            {teamResults.length > 0 && (
              <Section label="Teams" count={teamResults.length}>
                {teamResults.map((t) => (
                  <ResultRow
                    key={t.id}
                    onClick={() => go(`/teams/${t.id}`)}
                    onDismiss={() => dismiss(`team:${t.id}`)}
                    leading={<LetterAvatar letter={t.initial} size="sm" />}
                    title={t.name}
                    sub={t.locked ? "Private team" : "Team"}
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)]">
        <button
          onClick={() => go("/search")}
          className="w-full px-4 py-2.5 flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
        >
          <ExternalLink size={11} />
          <span>Open Search Page</span>
        </button>
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="px-4 py-8 text-center">
      <div className="text-xs text-[var(--text-muted)]">
        Start typing to search across the workspace.
      </div>
      <div className="mt-2 text-[11px] text-[var(--text-subtle)]">
        Try <Kbd>Ran</Kbd>, <Kbd>Q3</Kbd>, or <Kbd>Engineering</Kbd>.
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 text-[10px] rounded border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-muted)] mx-0.5">
      {children}
    </kbd>
  );
}

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="px-4 pt-3 pb-1 text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
        <span>{label}</span>
        <span className="text-[var(--text-subtle)] text-[11px] tabular-nums">
          [ {count} ]
        </span>
      </div>
      <ul>{children}</ul>
    </section>
  );
}

function ResultRow({
  leading,
  title,
  sub,
  onClick,
  onDismiss,
}: {
  leading: React.ReactNode;
  title: string;
  sub?: string;
  onClick: () => void;
  onDismiss: () => void;
}) {
  return (
    <li className="group">
      <div className="px-4 py-2 flex items-center gap-2.5 hover:bg-[var(--hover)] transition-colors">
        <div className="flex-shrink-0">{leading}</div>
        <button
          onClick={onClick}
          className="flex-1 min-w-0 text-left flex items-center gap-2"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[13px] truncate">{title}</div>
            {sub && (
              <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                {sub}
              </div>
            )}
          </div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss this result"
          className="h-6 w-6 flex items-center justify-center rounded text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <X size={11} />
        </button>
      </div>
    </li>
  );
}
