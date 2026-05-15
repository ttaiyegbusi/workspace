"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { LetterAvatar } from "@/components/letter-avatar";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification } from "@/lib/types";

type Tab = "all" | "unread";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NotificationsPanel({ open, onClose }: Props) {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const teams = useStore((s) => s.teams);
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        // Don't close when clicking the trigger itself
        !(e.target as HTMLElement).closest("[data-notifications-trigger]")
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    let list = notifications;
    if (tab === "unread") list = list.filter((n) => !n.read);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.authorName.toLowerCase().includes(q) ||
          n.preview.toLowerCase().includes(q) ||
          n.context.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q),
      );
    }
    // sort newest first
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [notifications, tab, query]);

  const groups = useMemo(() => groupByTime(filtered), [filtered]);

  function handleClick(n: Notification) {
    markRead(n.id);
    onClose();
    if (n.taskId) {
      // Find the team this task belongs to
      const teamId = useStore.getState().tasks.find((t) => t.id === n.taskId)
        ?.teamId;
      if (teamId) {
        useStore.getState().selectTask(teamId, n.taskId);
        router.push(`/teams/${teamId}`);
      }
    }
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-12 right-3 md:right-4 z-50 w-[360px] max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-5rem)] bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-[var(--shadow-lg)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Notifications</h3>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] px-1.5"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-4 border-b border-[var(--border)]">
        <TabBtn
          label="All"
          active={tab === "all"}
          onClick={() => setTab("all")}
        />
        <TabBtn
          label={`Unread`}
          count={unreadCount}
          active={tab === "unread"}
          onClick={() => setTab("unread")}
        />
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[var(--border)] relative">
        <Search
          size={13}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full h-8 pl-7 pr-3 text-[13px] bg-[var(--surface-2)] rounded outline-none placeholder:text-[var(--text-subtle)]"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        {groups.length === 0 ? (
          <div className="px-4 py-10 text-center text-xs text-[var(--text-subtle)]">
            {query ? `No notifications match "${query}"` : "You're all caught up"}
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.label}>
              <div className="px-4 pt-3 pb-1.5 text-[10px] tracking-[0.12em] text-[var(--text-subtle)] font-medium uppercase">
                {g.label}
              </div>
              <ul>
                {g.items.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-[var(--hover)] transition-colors border-b border-[var(--border)]"
                    >
                      <LetterAvatar
                        letter={n.authorName.charAt(0).toUpperCase()}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              "text-[13px] truncate",
                              !n.read && "font-medium",
                            )}
                          >
                            {n.authorName}
                          </span>
                          <span className="ml-auto text-[11px] text-[var(--text-subtle)] flex-shrink-0">
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                          <span>{n.type}</span>
                          <span className="text-[var(--text-subtle)]">•</span>
                          <span className="truncate">{n.context}</span>
                        </div>
                        <div
                          className={cn(
                            "text-[12px] mt-1 leading-relaxed line-clamp-3",
                            n.read
                              ? "text-[var(--text-muted)]"
                              : "text-[var(--text)]",
                          )}
                        >
                          {n.preview}
                        </div>
                      </div>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--text)] mt-1.5 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function TabBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 text-[12px] border-b-2 -mb-px transition-colors flex items-center gap-1",
        active
          ? "border-[var(--text)] text-[var(--text)] font-medium"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]",
      )}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span className="text-[var(--text-subtle)] text-[11px] tabular-nums">
          [ {count} ]
        </span>
      )}
    </button>
  );
}

type Group = { label: string; items: Notification[] };

function groupByTime(items: Notification[]): Group[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenAgo = new Date(today);
  sevenAgo.setDate(today.getDate() - 7);

  const groups: Record<string, Notification[]> = {};
  const order: string[] = [];

  function push(label: string, n: Notification) {
    if (!groups[label]) {
      groups[label] = [];
      order.push(label);
    }
    groups[label].push(n);
  }

  for (const n of items) {
    const d = new Date(n.createdAt);
    if (d >= today) push("Today", n);
    else if (d >= yesterday) push("Yesterday", n);
    else if (d >= sevenAgo) push("Last 7 days", n);
    else push("Older", n);
  }

  return order.map((label) => ({ label, items: groups[label]! }));
}
