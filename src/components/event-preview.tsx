"use client";

import { useEffect, useState } from "react";
import { Clock, Briefcase, Tag } from "lucide-react";
import type { CalendarEvent } from "@/lib/calendar-utils";
import { useStore } from "@/lib/store";

type Props = {
  event: CalendarEvent;
  /** Bounding rect of the anchor (the event chip the user is hovering). */
  anchorRect: DOMRect;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/** Floating preview popover positioned relative to the anchor's bounding rect.
 *  Shows only data that exists for the event — no empty placeholder rows. */
export function EventPreview({
  event,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  // Position: prefer to the right of the chip; if it would overflow the
  // viewport, render to the left. Vertical centerline-aligned with the chip,
  // clamped to viewport edges.
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const W = 280;
    const H = 180; // approximate height — we'll let it grow naturally
    const margin = 8;
    const gap = 8;

    let left = anchorRect.right + gap;
    if (left + W > window.innerWidth - margin) {
      left = anchorRect.left - W - gap;
    }
    if (left < margin) left = margin;

    let top = anchorRect.top + anchorRect.height / 2 - H / 2;
    if (top < margin) top = margin;
    if (top + H > window.innerHeight - margin) {
      top = window.innerHeight - H - margin;
    }
    setPos({ top, left });
  }, [anchorRect]);

  // Pull team info if this event is task-derived
  const teams = useStore((s) => s.teams);
  const team =
    event.source === "task" && event.teamId
      ? teams.find((t) => t.id === event.teamId)
      : null;

  if (!pos) return null;

  const start = new Date(event.start);
  const hasTime = !(start.getHours() === 0 && start.getMinutes() === 0);
  const dateStr = start.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = hasTime
    ? start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })
    : "All day";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-[80] w-[280px] rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-3.5 animate-toast-in"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* Title + color swatch */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <span
          aria-hidden
          className="mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color ?? "var(--text)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium leading-snug">
            {event.title}
          </div>
        </div>
      </div>

      {/* Details: date + time */}
      <div className="space-y-1.5 text-[12px]">
        <Row icon={Clock}>
          <span>{dateStr}</span>
          <span className="text-[var(--text-muted)] mx-1.5">·</span>
          <span className="tabular-nums">{timeStr}</span>
        </Row>

        {/* For task events, show the team */}
        {team && (
          <Row icon={Briefcase}>
            <span className="text-[var(--text-muted)]">Task in</span>{" "}
            <span className="text-[var(--text)]">{team.name}</span>
          </Row>
        )}

        {/* For standalone events, show a tag-like indicator */}
        {event.source === "standalone" && (
          <Row icon={Tag}>
            <span className="text-[var(--text-muted)]">Workspace event</span>
          </Row>
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[var(--text)]">
      <Icon
        size={11}
        className="text-[var(--text-muted)] flex-shrink-0"
        strokeWidth={1.6}
      />
      <span className="min-w-0">{children}</span>
    </div>
  );
}
