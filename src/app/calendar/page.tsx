"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/top-bar";
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const weekdayShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const weekdayFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
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

type CalendarView = "week" | "month";

type DayCell = {
  date: Date;
  label: string;
  inMonth: boolean;
};

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cells: DayCell[] = [];

  const startOffset = first.getDay();
  for (let i = startOffset - 1; i >= 0; i -= 1) {
    const date = new Date(year, month, -i);
    cells.push({ date, label: String(date.getDate()), inMonth: false });
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(year, month, day);
    cells.push({ date, label: String(day), inMonth: true });
  }

  const remainder = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainder; day += 1) {
    const date = new Date(year, month + 1, day);
    cells.push({ date, label: String(date.getDate()), inMonth: false });
  }

  return cells;
}

function getWeekDays(year: number, month: number, weekIndex: number) {
  const grid = getMonthGrid(year, month);
  const weeks: DayCell[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }
  return weeks[weekIndex] ?? weeks[0] ?? [];
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [view, setView] = useState<CalendarView>("month");

  const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  const monthCells = useMemo(
    () => getMonthGrid(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const today = useMemo(() => new Date(2026, 0, 21), []);
  const weekCells = useMemo(
    () => getWeekDays(currentMonth.getFullYear(), currentMonth.getMonth(), 3),
    [currentMonth],
  );

  return (
    <>
      <TopBar title="Calendar" />

      <div className="flex-1 min-h-0 px-5 md:px-8 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex items-center gap-3">
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
              <div className="text-sm font-medium text-[var(--text)]">
                {monthLabel}
              </div>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("week")}
                className={cn(
                  "rounded-full border px-3 py-2 text-[13px] transition-colors",
                  view === "week"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                )}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setView("month")}
                className={cn(
                  "rounded-full border px-3 py-2 text-[13px] transition-colors",
                  view === "month"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                )}
              >
                Month
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                  view === "week"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]",
                )}
                aria-label="Week view"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                  view === "month"
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]",
                )}
                aria-label="Month view"
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>

          {view === "month" ? (
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="grid grid-cols-7 gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                {weekdayShort.map((weekday) => (
                  <div key={weekday} className="text-center">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {monthCells.map((cell) => (
                  <div
                    key={cell.date.toISOString()}
                    className={cn(
                      "min-h-[120px] rounded-3xl border border-[var(--border)] p-3 text-sm",
                      cell.inMonth
                        ? "bg-[var(--surface)] text-[var(--text)]"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)]",
                    )}
                  >
                    <span className="font-medium">{cell.label}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="space-y-3">
              {weekCells.map((cell) => (
                <div
                  key={cell.date.toISOString()}
                  className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]" />
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {weekdayFull[cell.date.getDay()]}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-6xl font-semibold",
                      isSameDay(cell.date, today)
                        ? "text-[var(--text)]"
                        : "text-[var(--text-muted)]",
                    )}
                  >
                    {cell.label}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
