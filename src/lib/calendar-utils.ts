import type { Task } from "@/lib/types";

export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO datetime — date and (optionally) time of day */
  start: string;
  /** What the event is — drives the click behaviour. */
  source: "task" | "standalone";
  /** When source is "task", this is the team id so the click can navigate to it. */
  teamId?: string;
  /** When source is "task", this is the task id (for switching to that task). */
  taskId?: string;
  /** Visual accent — used for the chip color. */
  color?: string;
};

/** Are two Date objects on the same calendar day (in local time)? */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

/** Sunday = 0, Saturday = 6. Returns the Sunday at or before the given date. */
export function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

export function startOfMonth(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

/** Returns 7 consecutive dates starting from the Sunday of the given week. */
export function weekDays(anyDayInWeek: Date): Date[] {
  const start = startOfWeek(anyDayInWeek);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Returns 6 weeks of dates (42 total) for the month grid: starts from the
 *  Sunday on or before the 1st of the month, continues for 42 days. */
export function monthGridDays(anyDayInMonth: Date): Date[] {
  const start = startOfWeek(startOfMonth(anyDayInMonth));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

const MONTH_NAMES = [
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

export function monthLabel(d: Date): string {
  return MONTH_NAMES[d.getMonth()]!;
}

export function yearLabel(d: Date): string {
  return String(d.getFullYear());
}

export function fullMonthYear(d: Date): string {
  return `${monthLabel(d)} ${yearLabel(d)}`;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function dayName(d: Date): string {
  return DAY_NAMES[d.getDay()]!;
}

export function dayShort(d: Date): string {
  return DAY_SHORT[d.getDay()]!;
}

/** Format an event's start time. Returns "" for all-day events (no time). */
export function eventTimeLabel(iso: string): string {
  const d = new Date(iso);
  // If the time is midnight, treat as all-day
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

// ---------- Standalone seeded events ----------

/** A handful of events not tied to tasks. Anchored to dates relative to now
 *  so they always fall within the user's current month for an alive feel. */
function seededStandaloneEvents(): CalendarEvent[] {
  const now = new Date();
  function offset(days: number, hour: number, minute = 0): string {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  return [
    {
      id: "ev-1",
      title: "Driver Safety Training",
      start: offset(-3, 9, 30),
      source: "standalone",
      color: "#2563eb",
    },
    {
      id: "ev-2",
      title: "Quarterly Vendor Review",
      start: offset(2, 14, 0),
      source: "standalone",
      color: "#16a34a",
    },
    {
      id: "ev-3",
      title: "All-Hands Town Hall",
      start: offset(5, 16, 0),
      source: "standalone",
      color: "#dc2626",
    },
    {
      id: "ev-4",
      title: "Lagos Hub Site Visit",
      start: offset(8, 11, 0),
      source: "standalone",
      color: "#9333ea",
    },
    {
      id: "ev-5",
      title: "Carrier Rate Negotiations",
      start: offset(-1, 10, 30),
      source: "standalone",
      color: "#ea580c",
    },
    {
      id: "ev-6",
      title: "Loading Bay Audit",
      start: offset(11, 8, 0),
      source: "standalone",
      color: "#0d9488",
    },
    {
      id: "ev-7",
      title: "Monthly Ops Sync",
      start: offset(14, 15, 0),
      source: "standalone",
      color: "#2563eb",
    },
    {
      id: "ev-8",
      title: "Procurement Forecast Review",
      start: offset(-7, 13, 0),
      source: "standalone",
      color: "#16a34a",
    },
  ];
}

/** Combine task-derived events (one per task with a due date) with seeded
 *  standalone events. */
export function buildEvents(tasks: Task[]): CalendarEvent[] {
  const taskEvents: CalendarEvent[] = tasks
    .filter((t) => !!t.dueDate)
    .map((t) => ({
      id: `task:${t.id}`,
      title: t.title,
      start: t.dueDate!,
      source: "task" as const,
      teamId: t.teamId,
      taskId: t.id,
      color: "#1a1a1a",
    }));
  return [...taskEvents, ...seededStandaloneEvents()];
}

/** Bucket events by their local-date key, e.g. "2026-01-21". */
export function bucketByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const d = new Date(ev.start);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const arr = map.get(key) ?? [];
    arr.push(ev);
    map.set(key, arr);
  }
  // Sort each bucket by start time
  for (const arr of map.values()) {
    arr.sort((a, b) => a.start.localeCompare(b.start));
  }
  return map;
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Generate N months of dates centered around `anchor`. `before` and `after`
 *  control how many months on each side. Returns an array of "first day of
 *  each month" Dates from oldest to newest. */
export function monthRange(anchor: Date, before: number, after: number): Date[] {
  return Array.from({ length: before + after + 1 }, (_, i) =>
    startOfMonth(addMonths(anchor, i - before)),
  );
}

/** Format the Day view's date heading. "17 May 2026" */
export function fullDayHeading(d: Date): string {
  return `${d.getDate()} ${monthLabel(d)} ${d.getFullYear()}`;
}
