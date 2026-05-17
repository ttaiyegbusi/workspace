"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/top-bar";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const calendarEvents = [
  {
    id: "e-1",
    date: "2026-01-11",
    title: "Warehouse planning review",
    when: "09:00 AM",
    location: "Main room",
    color: "bg-[#D8EAFE]",
  },
  {
    id: "e-2",
    date: "2026-01-14",
    title: "Operations sync",
    when: "11:30 AM",
    location: "Conference B",
    color: "bg-[#E8F6D7]",
  },
  {
    id: "e-3",
    date: "2026-01-17",
    title: "Inventory audit kickoff",
    when: "02:00 PM",
    location: "HQ",
    color: "bg-[#FCE8D7]",
  },
  {
    id: "e-4",
    date: "2026-01-22",
    title: "Customer experience check-in",
    when: "10:00 AM",
    location: "Remote",
    color: "bg-[#F4E1FD]",
  },
  {
    id: "e-5",
    date: "2026-01-28",
    title: "Sprint planning",
    when: "03:30 PM",
    location: "Room 4",
    color: "bg-[#D9F2E6]",
  },
];

type ViewMode = "grid" | "gallery";

type DayCell = {
  date: Date | null;
  label: string;
  inMonth: boolean;
};

function getMonthDays(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();
  const firstWeekday = firstOfMonth.getDay();
  const cells = [] as DayCell[];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ date: null, label: "", inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ date, label: String(day), inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, label: "", inMonth: false });
  }

  return cells;
}

function formatIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [view, setView] = useState<ViewMode>("grid");

  const monthDays = useMemo(
    () => getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const visibleDays = useMemo(
    () => monthDays.filter((cell) => cell.date && cell.inMonth) as DayCell[],
    [monthDays],
  );

  const eventsByDay = useMemo(() => {
    return calendarEvents.reduce<Record<string, typeof calendarEvents>>(
      (acc, event) => {
        acc[event.date] = acc[event.date]
          ? [...acc[event.date], event]
          : [event];
        return acc;
      },
      {},
    );
  }, []);

  const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <>
      <TopBar title="Calendar" />

      <div className="flex-1 min-h-0 px-5 md:px-8 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">
                Calendar
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                {monthLabel}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Switch between a month grid and gallery-style day view for
                planning and review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(today)}
                className="inline-flex h-9 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-[var(--text-muted)]" size={16} />
              <span className="text-sm font-medium text-[var(--text)]">
                {view === "grid" ? "Month grid" : "Gallery view"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("gallery")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] transition-colors",
                  view === "gallery"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                )}
              >
                <List size={14} />
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] transition-colors",
                  view === "grid"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                )}
              >
                <LayoutGrid size={14} />
                Grid
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="grid grid-cols-7 gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                {weekdayNames.map((weekday) => (
                  <div key={weekday} className="text-center">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {monthDays.map((cell, index) => {
                  const dateKey = cell.date ? formatIso(cell.date) : "";
                  const cellEvents = cell.inMonth
                    ? (eventsByDay[dateKey] ?? [])
                    : [];
                  const isToday = cell.date
                    ? formatIso(cell.date) === formatIso(today)
                    : false;

                  return (
                    <div
                      key={`${dateKey}-${index}`}
                      className={cn(
                        "min-h-[120px] rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm",
                        cell.inMonth
                          ? "bg-[var(--surface)]"
                          : "bg-[var(--surface-2)]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "font-medium",
                            isToday
                              ? "text-[var(--text)]"
                              : "text-[var(--text-muted)]",
                          )}
                        >
                          {cell.label}
                        </span>
                        {isToday && (
                          <span className="rounded-full bg-[var(--text)] px-2 py-0.5 text-[10px] font-semibold text-[var(--surface)]">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="mt-3 space-y-2">
                        {cellEvents.length > 0 ? (
                          cellEvents.map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "rounded-2xl border border-[var(--border)] p-2",
                                event.color,
                              )}
                            >
                              <p className="text-[12px] font-semibold text-[var(--text)]">
                                {event.title}
                              </p>
                              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                                {event.when} · {event.location}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-[11px] text-[var(--text-muted)]">
                            No events
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="space-y-3">
              {visibleDays.map((cell) => {
                const dateKey = formatIso(cell.date!);
                const cellEvents = eventsByDay[dateKey] ?? [];
                const dayLabel = cell.date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                });
                const dayNumber = cell.date?.getDate();

                return (
                  <div
                    key={dateKey}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                          {weekdayNames[cell.date!.getDay()]}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                          {dayLabel}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-[var(--bg)] px-5 py-3 text-4xl font-semibold text-[var(--text)]">
                        {dayNumber}
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {cellEvents.length > 0 ? (
                        cellEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "rounded-3xl border border-[var(--border)] p-4",
                              event.color,
                            )}
                          >
                            <p className="text-sm font-semibold text-[var(--text)]">
                              {event.title}
                            </p>
                            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                              {event.when} · {event.location}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] px-4 py-5 text-sm text-[var(--text-muted)]">
                          No events scheduled.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
