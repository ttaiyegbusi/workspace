"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, List, LayoutGrid } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { useStore } from "@/lib/store";
import { useLocalStoragePref } from "@/lib/use-local-storage-pref";
import {
  addDays,
  addMonths,
  buildEvents,
  bucketByDay,
  dayKey,
  dayName,
  dayShort,
  eventTimeLabel,
  fullMonthYear,
  isSameDay,
  monthGridDays,
  monthLabel,
  startOfMonth,
  startOfWeek,
  weekDays,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

type View = "week" | "month";

export default function CalendarPage() {
  const router = useRouter();
  const tasks = useStore((s) => s.tasks);

  const [view, setView] = useLocalStoragePref<View>("calendar-view", "month");

  // The current "anchor" date: in Week mode it's any day in the visible week;
  // in Month mode it's any day in the visible month. Defaults to today on
  // each mount (we don't persist this — calendars expect to land on "today").
  const [anchor, setAnchor] = useState<Date | null>(null);
  // Today is also derived after mount to avoid SSR/client timezone mismatch
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setAnchor(now);
    setToday(now);
  }, []);

  // Derive events after mount so server-rendered HTML doesn't depend on local time
  const events: CalendarEvent[] = useMemo(
    () => (today ? buildEvents(tasks) : []),
    [tasks, today],
  );
  const eventsByDay = useMemo(() => bucketByDay(events), [events]);

  function step(direction: -1 | 1) {
    if (!anchor) return;
    if (view === "week") {
      setAnchor(addDays(anchor, direction * 7));
    } else {
      setAnchor(addMonths(anchor, direction));
    }
  }

  function handleEventClick(ev: CalendarEvent) {
    if (ev.source === "task" && ev.teamId) {
      router.push(`/teams/${ev.teamId}`);
    }
    // Standalone events are stubs — no-op
  }

  // Decide what month label to show in the header
  const headerLabel = anchor ? fullMonthYear(anchor) : "";
  const navLabel = anchor ? monthLabel(anchor) : "";

  return (
    <>
      <TopBar title="Calendar" />

      {/* Header row */}
      <div className="px-5 md:px-8 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl md:text-2xl font-medium tracking-tight">
          {headerLabel || "\u00A0"}
        </h1>

        <div className="flex items-center gap-3">
          {/* Month navigator */}
          <div className="inline-flex items-center gap-1.5 border border-[var(--border)] rounded h-8 px-1.5">
            <button
              onClick={() => step(-1)}
              aria-label="Previous"
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] text-[var(--text)] min-w-[68px] text-center">
              {navLabel || "\u00A0"}
            </span>
            <button
              onClick={() => step(1)}
              aria-label="Next"
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* View toggle */}
          <div className="inline-flex items-center border border-[var(--border)] rounded h-8 overflow-hidden">
            <SegBtn
              active={view === "week"}
              onClick={() => setView("week")}
              icon={<List size={13} />}
              label="Week"
            />
            <SegBtn
              active={view === "month"}
              onClick={() => setView("month")}
              icon={<LayoutGrid size={13} />}
              label="Month"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        {anchor && today && view === "week" && (
          <WeekView
            anchor={anchor}
            today={today}
            eventsByDay={eventsByDay}
            onEventClick={handleEventClick}
          />
        )}
        {anchor && today && view === "month" && (
          <MonthView
            anchor={anchor}
            today={today}
            eventsByDay={eventsByDay}
            onEventClick={handleEventClick}
          />
        )}
        {/* SSR placeholder: empty container, no flash of unstyled grid */}
        {(!anchor || !today) && <div aria-hidden className="h-full" />}
      </div>
    </>
  );
}

// ---------- Segmented button (Week / Month) ----------

function SegBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-full px-2.5 flex items-center gap-1.5 text-[12px] transition-colors",
        active
          ? "bg-[var(--text)] text-[var(--surface)]"
          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover)]",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ---------- Week view ----------

function WeekView({
  anchor,
  today,
  eventsByDay,
  onEventClick,
}: {
  anchor: Date;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
}) {
  const days = weekDays(anchor);

  return (
    <ul>
      {days.map((d) => {
        const isToday = isSameDay(d, today);
        const dayEvents = eventsByDay.get(dayKey(d)) ?? [];
        return (
          <li
            key={d.toISOString()}
            className={cn(
              "border-b border-[var(--border)] flex items-stretch",
              isToday && "bg-[var(--surface-2)]",
            )}
          >
            {/* Left: dot + day name */}
            <div className="flex-shrink-0 w-[160px] md:w-[200px] px-5 md:px-8 py-6 flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isToday
                    ? "bg-[var(--text)]"
                    : "bg-[var(--text-subtle)]",
                )}
              />
              <span
                className={cn(
                  "text-[15px]",
                  isToday
                    ? "font-medium text-[var(--text)]"
                    : "text-[var(--text)]",
                )}
              >
                {dayName(d)}
              </span>
            </div>

            {/* Middle: events list */}
            <div className="flex-1 min-w-0 py-6 pr-4 flex flex-col justify-center gap-1.5">
              {dayEvents.map((ev) => {
                const time = eventTimeLabel(ev.start);
                return (
                  <button
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className="text-left flex items-center gap-2 max-w-full px-2 py-1 rounded hover:bg-[var(--hover)] text-[13px] min-w-0"
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ev.color ?? "var(--text)" }}
                    />
                    {time && (
                      <span className="text-[var(--text-muted)] tabular-nums flex-shrink-0">
                        {time}
                      </span>
                    )}
                    <span className="truncate">{ev.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: large day number */}
            <div className="flex-shrink-0 w-[100px] md:w-[140px] flex items-center justify-end pr-5 md:pr-8 py-4">
              <span
                className={cn(
                  "text-5xl md:text-6xl font-medium tabular-nums leading-none",
                  isToday
                    ? "text-[var(--text)]"
                    : "text-[var(--text)]",
                )}
              >
                {d.getDate()}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------- Month view ----------

const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function MonthView({
  anchor,
  today,
  eventsByDay,
  onEventClick,
}: {
  anchor: Date;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
}) {
  const days = monthGridDays(anchor);
  const month = anchor.getMonth();

  return (
    <div className="flex flex-col h-full min-h-[640px]">
      {/* Column headers */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="px-3 py-2.5 text-[10px] font-medium tracking-[0.08em] text-[var(--text-muted)] border-r border-[var(--border)] last:border-r-0"
          >
            {h}
          </div>
        ))}
      </div>

      {/* 6-row × 7-col grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((d) => {
          const inMonth = d.getMonth() === month;
          const isToday = isSameDay(d, today);
          const dayEvents = eventsByDay.get(dayKey(d)) ?? [];
          return (
            <DayCell
              key={d.toISOString()}
              date={d}
              inMonth={inMonth}
              isToday={isToday}
              events={dayEvents}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({
  date,
  inMonth,
  isToday,
  events,
  onEventClick,
}: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onEventClick: (ev: CalendarEvent) => void;
}) {
  const visible = events.slice(0, 3);
  const overflow = events.length - visible.length;

  return (
    <div
      className={cn(
        "relative border-r border-b border-[var(--border)] day-cell p-2 flex flex-col gap-1 min-h-[96px]",
        // Out-of-month cells get a diagonal-stripe background
        !inMonth && "out-of-month-cell",
      )}
    >
      {/* Date number — circled when today */}
      <div className="flex items-center justify-start">
        <span
          className={cn(
            "inline-flex items-center justify-center h-6 w-6 rounded-full text-[12px] tabular-nums",
            isToday && "bg-[var(--text)] text-[var(--surface)] font-medium",
            !isToday && !inMonth && "text-[var(--text-subtle)]",
            !isToday && inMonth && "text-[var(--text)]",
          )}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Event chips */}
      <div className="flex-1 min-h-0 flex flex-col gap-0.5 overflow-hidden">
        {visible.map((ev) => {
          const time = eventTimeLabel(ev.start);
          return (
            <button
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className="w-full text-left px-1.5 py-0.5 rounded text-[10.5px] flex items-center gap-1 hover:bg-[var(--hover)] min-w-0"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: ev.color ?? "var(--text)" }}
              />
              {time && (
                <span className="text-[var(--text-muted)] tabular-nums flex-shrink-0">
                  {time}
                </span>
              )}
              <span className="truncate text-[var(--text)]">{ev.title}</span>
            </button>
          );
        })}
        {overflow > 0 && (
          <span className="px-1.5 text-[10.5px] text-[var(--text-muted)]">
            +{overflow} more
          </span>
        )}
      </div>
    </div>
  );
}
