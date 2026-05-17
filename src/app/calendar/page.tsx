"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  CalendarDays,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { useStore } from "@/lib/store";
import { useLocalStoragePref } from "@/lib/use-local-storage-pref";
import { EventPreview } from "@/components/event-preview";
import {
  addDays,
  addMonths,
  buildEvents,
  bucketByDay,
  dayKey,
  dayName,
  eventTimeLabel,
  fullDayHeading,
  fullMonthYear,
  isSameDay,
  monthGridDays,
  monthLabel,
  monthRange,
  startOfMonth,
  weekDays,
  startOfWeek,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

type View = "day" | "week" | "month";

const MONTHS_BEFORE = 12;
const MONTHS_AFTER = 12;
const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarPage() {
  const router = useRouter();
  const tasks = useStore((s) => s.tasks);

  const [view, setView] = useLocalStoragePref<View>("calendar-view", "month");
  const [today, setToday] = useState<Date | null>(null);
  // The date currently "in focus" — drives the header label and Day view.
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setFocusedDate(now);
  }, []);

  const events: CalendarEvent[] = useMemo(
    () => (today ? buildEvents(tasks) : []),
    [tasks, today],
  );
  const eventsByDay = useMemo(() => bucketByDay(events), [events]);

  function handleEventClick(ev: CalendarEvent) {
    if (ev.source === "task" && ev.teamId) {
      router.push(`/teams/${ev.teamId}`);
    }
  }

  function jumpToDay(day: Date) {
    setFocusedDate(day);
    setView("day");
  }

  const headerLabel = focusedDate ? fullMonthYear(focusedDate) : "";
  const navLabel = focusedDate ? monthLabel(focusedDate) : "";

  // Step button behaviour: in Day view, step by a day. In other views, the
  // step is handled by the scroll-by-month logic in the view itself, so the
  // header buttons just emit a "jump by 1 month" intent that the view picks
  // up via the `requestedScrollMonth` state.
  const [scrollIntent, setScrollIntent] = useState(0);
  function step(direction: -1 | 1) {
    if (!focusedDate) return;
    if (view === "day") {
      setFocusedDate(addDays(focusedDate, direction));
    } else {
      setFocusedDate(addMonths(focusedDate, direction));
      setScrollIntent((n) => n + direction);
    }
  }

  return (
    <>
      <TopBar title="Calendar" />

      {/* Header row */}
      <div className="px-5 md:px-8 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
        {/* Month / day heading. Uses key to retrigger the animation on change. */}
        <h1
          key={`${view}-${headerLabel}`}
          className="text-xl md:text-2xl font-medium tracking-tight animate-month-label"
        >
          {view === "day" && focusedDate
            ? fullDayHeading(focusedDate)
            : headerLabel || "\u00A0"}
        </h1>

        <div className="flex items-center gap-3">
          {/* Navigator */}
          <div className="inline-flex items-center gap-1.5 border border-[var(--border)] rounded h-8 px-1.5">
            <button
              onClick={() => step(-1)}
              aria-label="Previous"
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
            >
              <ChevronLeft size={14} />
            </button>
            <span
              key={navLabel + view}
              className="text-[12px] text-[var(--text)] min-w-[68px] text-center animate-month-label"
            >
              {view === "day" && focusedDate
                ? dayName(focusedDate)
                : navLabel || "\u00A0"}
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
              active={view === "day"}
              onClick={() => setView("day")}
              icon={<CalendarDays size={13} />}
              label="Day"
            />
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
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {focusedDate && today && view === "month" && (
          <MonthScroller
            today={today}
            focusedDate={focusedDate}
            scrollIntent={scrollIntent}
            onVisibleMonthChange={setFocusedDate}
            eventsByDay={eventsByDay}
            onEventClick={handleEventClick}
            onDayClick={jumpToDay}
          />
        )}
        {focusedDate && today && view === "week" && (
          <WeekScroller
            today={today}
            focusedDate={focusedDate}
            scrollIntent={scrollIntent}
            onVisibleWeekChange={setFocusedDate}
            eventsByDay={eventsByDay}
            onEventClick={handleEventClick}
            onDayClick={jumpToDay}
          />
        )}
        {focusedDate && today && view === "day" && (
          <DayView
            day={focusedDate}
            today={today}
            eventsByDay={eventsByDay}
            onEventClick={handleEventClick}
          />
        )}
      </div>
    </>
  );
}

// ---------- Segmented button ----------

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
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ---------- Event hover wrapper ----------

function HoverableEvent({
  event,
  onClick,
  children,
}: {
  event: CalendarEvent;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleShow() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (previewing) return;
    showTimer.current = setTimeout(() => {
      if (ref.current) {
        setAnchorRect(ref.current.getBoundingClientRect());
        setPreviewing(true);
      }
    }, 250);
  }

  function scheduleHide() {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => {
      setPreviewing(false);
      setAnchorRect(null);
    }, 100);
  }

  function cancelHide() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
        className="block w-full text-left p-0 m-0 bg-transparent border-0 cursor-pointer"
      >
        {children}
      </button>
      {previewing && anchorRect && (
        <EventPreview
          event={event}
          anchorRect={anchorRect}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}
    </>
  );
}

// ---------- Month scroller (24 months stacked) ----------

function MonthScroller({
  today,
  focusedDate,
  scrollIntent,
  onVisibleMonthChange,
  eventsByDay,
  onEventClick,
  onDayClick,
}: {
  today: Date;
  focusedDate: Date;
  scrollIntent: number;
  onVisibleMonthChange: (d: Date) => void;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (d: Date) => void;
}) {
  const months = useMemo(
    () => monthRange(today, MONTHS_BEFORE, MONTHS_AFTER),
    [today],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // Tracks the "intended scroll target". On mount we auto-scroll to today,
  // and on header-arrow click we scroll to focusedDate's month.
  const lastJumpedIntent = useRef<number | null>(null);
  const initialised = useRef(false);

  // Initial scroll: jump to today's month on mount
  useEffect(() => {
    if (initialised.current) return;
    const key = `${today.getFullYear()}-${today.getMonth()}`;
    const el = monthRefs.current.get(key);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTop = el.offsetTop;
      initialised.current = true;
    }
  }, [today]);

  // When the header arrows fire (scrollIntent changes), smoothly scroll to
  // the new focused month.
  useEffect(() => {
    if (!initialised.current) return;
    if (lastJumpedIntent.current === scrollIntent) return;
    lastJumpedIntent.current = scrollIntent;
    const key = `${focusedDate.getFullYear()}-${focusedDate.getMonth()}`;
    const el = monthRefs.current.get(key);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  }, [scrollIntent, focusedDate]);

  // IntersectionObserver: track which month is currently at the top of the
  // viewport and update the header.
  // We hold focusedDate in a ref so the effect doesn't tear down/rebuild the
  // observer every time the focused month changes.
  const focusedRef = useRef(focusedDate);
  useEffect(() => {
    focusedRef.current = focusedDate;
  }, [focusedDate]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const root = scrollRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { el: HTMLDivElement; topDiff: number } | null = null;
        const rootRect = root.getBoundingClientRect();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLDivElement;
          const elRect = el.getBoundingClientRect();
          const topDiff = Math.abs(elRect.top - rootRect.top);
          if (best === null || topDiff < best.topDiff) {
            best = { el, topDiff };
          }
          el.classList.add("calendar-month-revealed");
        }
        if (best) {
          const monthIso = best.el.dataset.monthIso;
          if (monthIso) {
            const d = new Date(monthIso);
            const cur = focusedRef.current;
            if (
              d.getFullYear() !== cur.getFullYear() ||
              d.getMonth() !== cur.getMonth()
            ) {
              onVisibleMonthChange(d);
            }
          }
        }
      },
      {
        root,
        rootMargin: "0px 0px -60% 0px",
        threshold: [0, 0.05, 0.5],
      },
    );
    monthRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onVisibleMonthChange]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto scroll-thin"
    >
      {months.map((m) => (
        <MonthBlock
          key={m.toISOString()}
          monthStart={m}
          registerRef={(el) => {
            const key = `${m.getFullYear()}-${m.getMonth()}`;
            if (el) monthRefs.current.set(key, el);
            else monthRefs.current.delete(key);
          }}
          today={today}
          eventsByDay={eventsByDay}
          onEventClick={onEventClick}
          onDayClick={onDayClick}
        />
      ))}
    </div>
  );
}

function MonthBlock({
  monthStart,
  registerRef,
  today,
  eventsByDay,
  onEventClick,
  onDayClick,
}: {
  monthStart: Date;
  registerRef: (el: HTMLDivElement | null) => void;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (d: Date) => void;
}) {
  const days = useMemo(() => monthGridDays(monthStart), [monthStart]);
  const month = monthStart.getMonth();

  return (
    <div
      ref={registerRef}
      data-month-iso={monthStart.toISOString()}
      className="calendar-month"
    >
      {/* Month sticky label */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] px-5 md:px-8 py-2.5 text-[11px] tracking-[0.08em] font-medium text-[var(--text-muted)] border-b border-[var(--border)]">
        {fullMonthYear(monthStart).toUpperCase()}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="px-3 py-2 text-[10px] font-medium tracking-[0.08em] text-[var(--text-muted)] border-r border-[var(--border)] last:border-r-0"
          >
            {h}
          </div>
        ))}
      </div>

      {/* 6-row grid */}
      <div className="grid grid-cols-7 grid-rows-6">
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
              onDayClick={onDayClick}
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
  onDayClick,
}: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (d: Date) => void;
}) {
  const visible = events.slice(0, 3);
  const overflow = events.length - visible.length;

  return (
    <div
      onClick={() => onDayClick(date)}
      className={cn(
        "relative border-r border-b border-[var(--border)] day-cell p-2 flex flex-col gap-1 min-h-[96px] cursor-pointer",
        !inMonth && "out-of-month-cell",
        "hover:bg-[var(--hover)] transition-colors",
      )}
    >
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

      <div className="flex-1 min-h-0 flex flex-col gap-0.5 overflow-hidden">
        {visible.map((ev) => {
          const time = eventTimeLabel(ev.start);
          return (
            <HoverableEvent
              key={ev.id}
              event={ev}
              onClick={() => onEventClick(ev)}
            >
              <span className="w-full text-left px-1.5 py-0.5 rounded text-[10.5px] flex items-center gap-1 hover:bg-[var(--surface-2)] min-w-0">
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
              </span>
            </HoverableEvent>
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

// ---------- Week scroller ----------

function WeekScroller({
  today,
  focusedDate,
  scrollIntent,
  onVisibleWeekChange,
  eventsByDay,
  onEventClick,
  onDayClick,
}: {
  today: Date;
  focusedDate: Date;
  scrollIntent: number;
  onVisibleWeekChange: (d: Date) => void;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (d: Date) => void;
}) {
  // Generate ~25 months × ~4.5 weeks ≈ 110 weeks
  const weeks = useMemo(() => {
    const firstMonth = startOfMonth(addMonths(today, -MONTHS_BEFORE));
    const start = startOfWeek(firstMonth);
    const list: Date[] = [];
    const totalDays = (MONTHS_BEFORE + MONTHS_AFTER + 1) * 31;
    for (let i = 0; i * 7 < totalDays; i++) {
      list.push(addDays(start, i * 7));
    }
    return list;
  }, [today]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const weekRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastJumpedIntent = useRef<number | null>(null);
  const initialised = useRef(false);

  // Initial scroll: jump to today's week
  useEffect(() => {
    if (initialised.current) return;
    const todaysWeekStart = startOfWeek(today);
    const key = todaysWeekStart.toISOString();
    const el = weekRefs.current.get(key);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTop = el.offsetTop;
      initialised.current = true;
    }
  }, [today]);

  useEffect(() => {
    if (!initialised.current) return;
    if (lastJumpedIntent.current === scrollIntent) return;
    lastJumpedIntent.current = scrollIntent;
    // Find the first week of focusedDate's month
    const target = startOfWeek(startOfMonth(focusedDate));
    const key = target.toISOString();
    const el = weekRefs.current.get(key);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  }, [scrollIntent, focusedDate]);

  // Ref to avoid rebuilding the observer when focused date changes
  const focusedRef = useRef(focusedDate);
  useEffect(() => {
    focusedRef.current = focusedDate;
  }, [focusedDate]);

  // IO for tracking visible week's month
  useEffect(() => {
    if (!scrollRef.current) return;
    const root = scrollRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { el: HTMLDivElement; topDiff: number } | null = null;
        const rootRect = root.getBoundingClientRect();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLDivElement;
          const elRect = el.getBoundingClientRect();
          const topDiff = Math.abs(elRect.top - rootRect.top);
          if (best === null || topDiff < best.topDiff) {
            best = { el, topDiff };
          }
        }
        if (best) {
          const weekIso = best.el.dataset.weekIso;
          if (weekIso) {
            const d = new Date(weekIso);
            const cur = focusedRef.current;
            if (
              d.getFullYear() !== cur.getFullYear() ||
              d.getMonth() !== cur.getMonth()
            ) {
              onVisibleWeekChange(d);
            }
          }
        }
      },
      {
        root,
        rootMargin: "0px 0px -60% 0px",
        threshold: [0, 0.05, 0.5],
      },
    );
    weekRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onVisibleWeekChange]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto scroll-thin"
    >
      {weeks.map((w) => (
        <WeekBlock
          key={w.toISOString()}
          weekStart={w}
          registerRef={(el) => {
            const key = w.toISOString();
            if (el) weekRefs.current.set(key, el);
            else weekRefs.current.delete(key);
          }}
          today={today}
          eventsByDay={eventsByDay}
          onEventClick={onEventClick}
          onDayClick={onDayClick}
        />
      ))}
    </div>
  );
}

function WeekBlock({
  weekStart,
  registerRef,
  today,
  eventsByDay,
  onEventClick,
  onDayClick,
}: {
  weekStart: Date;
  registerRef: (el: HTMLDivElement | null) => void;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (d: Date) => void;
}) {
  const days = useMemo(() => weekDays(weekStart), [weekStart]);

  return (
    <div ref={registerRef} data-week-iso={weekStart.toISOString()}>
      <ul>
        {days.map((d) => {
          const isToday = isSameDay(d, today);
          const dayEvents = eventsByDay.get(dayKey(d)) ?? [];
          return (
            <li
              key={d.toISOString()}
              onClick={() => onDayClick(d)}
              className={cn(
                "border-b border-[var(--border)] flex items-stretch cursor-pointer hover:bg-[var(--hover)] transition-colors",
                isToday && "bg-[var(--surface-2)] hover:bg-[var(--surface-2)]",
              )}
            >
              <div className="flex-shrink-0 w-[160px] md:w-[200px] px-5 md:px-8 py-6 flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isToday ? "bg-[var(--text)]" : "bg-[var(--text-subtle)]",
                  )}
                />
                <span
                  className={cn(
                    "text-[15px]",
                    isToday && "font-medium",
                  )}
                >
                  {dayName(d)}
                </span>
              </div>

              <div className="flex-1 min-w-0 py-6 pr-4 flex flex-col justify-center gap-1.5">
                {dayEvents.map((ev) => {
                  const time = eventTimeLabel(ev.start);
                  return (
                    <HoverableEvent
                      key={ev.id}
                      event={ev}
                      onClick={() => onEventClick(ev)}
                    >
                      <span className="text-left flex items-center gap-2 max-w-full px-2 py-1 rounded hover:bg-[var(--surface-2)] text-[13px] min-w-0">
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: ev.color ?? "var(--text)",
                          }}
                        />
                        {time && (
                          <span className="text-[var(--text-muted)] tabular-nums flex-shrink-0">
                            {time}
                          </span>
                        )}
                        <span className="truncate">{ev.title}</span>
                      </span>
                    </HoverableEvent>
                  );
                })}
              </div>

              <div className="flex-shrink-0 w-[100px] md:w-[140px] flex items-center justify-end pr-5 md:pr-8 py-4">
                <span className="text-5xl md:text-6xl font-medium tabular-nums leading-none">
                  {d.getDate()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Day view ----------

const HOUR_HEIGHT = 60; // px per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function DayView({
  day,
  today,
  eventsByDay,
  onEventClick,
}: {
  day: Date;
  today: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (ev: CalendarEvent) => void;
}) {
  const isToday = isSameDay(day, today);
  const events = eventsByDay.get(dayKey(day)) ?? [];

  // Separate all-day events (events at midnight) from timed
  const allDay = events.filter((e) => {
    const d = new Date(e.start);
    return d.getHours() === 0 && d.getMinutes() === 0;
  });
  const timed = events.filter((e) => {
    const d = new Date(e.start);
    return !(d.getHours() === 0 && d.getMinutes() === 0);
  });

  // Now-line position
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);
  useEffect(() => {
    if (!isToday) {
      setNowMinutes(null);
      return;
    }
    function update() {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [isToday]);

  // Auto-scroll: on today, to the now line; otherwise to 08:00.
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    if (!scrollRef.current) return;
    const targetMinute = isToday && nowMinutes !== null ? nowMinutes : 8 * 60;
    const target = (targetMinute / 60) * HOUR_HEIGHT - 100;
    scrollRef.current.scrollTop = Math.max(0, target);
    initialised.current = true;
  }, [isToday, nowMinutes]);

  // Reset the init flag when the day changes
  useEffect(() => {
    initialised.current = false;
  }, [day]);

  const formatHour = useCallback((h: number) => {
    return `${String(h).padStart(2, "0")}:00`;
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* All-day strip */}
      <div className="flex items-stretch border-b border-[var(--border)] flex-shrink-0">
        <div className="w-[72px] md:w-[88px] px-3 py-2 text-[10px] text-[var(--text-muted)] tracking-[0.08em] flex items-center justify-end border-r border-[var(--border)]">
          all-day
        </div>
        <div className="flex-1 px-3 py-2 flex flex-wrap gap-1.5">
          {allDay.length === 0 ? (
            <span className="text-[12px] text-[var(--text-subtle)]">—</span>
          ) : (
            allDay.map((ev) => (
              <HoverableEvent
                key={ev.id}
                event={ev}
                onClick={() => onEventClick(ev)}
              >
                <span
                  className="px-2 py-0.5 rounded text-[12px] flex items-center gap-1.5"
                  style={{
                    backgroundColor: (ev.color ?? "#1a1a1a") + "20",
                    color: ev.color ?? "var(--text)",
                  }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ev.color ?? "var(--text)" }}
                  />
                  <span>{ev.title}</span>
                </span>
              </HoverableEvent>
            ))
          )}
        </div>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto scroll-thin">
        <div
          className="relative flex"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {/* Hour labels column */}
          <div className="w-[72px] md:w-[88px] flex-shrink-0 border-r border-[var(--border)] relative">
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-3 text-[10px] text-[var(--text-muted)] tracking-[0.04em]"
                style={{ top: h * HOUR_HEIGHT - 5 }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Timeline area */}
          <div className="flex-1 relative">
            {/* Hour grid lines */}
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute left-0 right-0 border-t border-[var(--border)]"
                style={{ top: h * HOUR_HEIGHT }}
              />
            ))}

            {/* Events */}
            {timed.map((ev) => {
              const start = new Date(ev.start);
              const startMin = start.getHours() * 60 + start.getMinutes();
              // Assume 1-hour duration for all events (no end-time in our model)
              const durationMin = 60;
              const top = (startMin / 60) * HOUR_HEIGHT;
              const height = (durationMin / 60) * HOUR_HEIGHT - 2;
              const color = ev.color ?? "#1a1a1a";
              return (
                <HoverableEvent
                  key={ev.id}
                  event={ev}
                  onClick={() => onEventClick(ev)}
                >
                  <span
                    className="absolute left-2 right-3 px-2 py-1 rounded text-[12px] flex flex-col gap-0.5 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      top,
                      height,
                      backgroundColor: color + "18",
                      borderLeft: `3px solid ${color}`,
                      color: "var(--text)",
                    }}
                  >
                    <span className="font-medium truncate">{ev.title}</span>
                    <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
                      {eventTimeLabel(ev.start)}
                    </span>
                  </span>
                </HoverableEvent>
              );
            })}

            {/* Now line (only on today) */}
            {isToday && nowMinutes !== null && (
              <>
                <div
                  className="absolute left-0 right-0 h-px bg-[var(--danger)] z-10"
                  style={{ top: (nowMinutes / 60) * HOUR_HEIGHT }}
                />
                <span
                  className="absolute -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium tabular-nums bg-[var(--danger)] text-white z-10"
                  style={{
                    top: (nowMinutes / 60) * HOUR_HEIGHT,
                    left: -36,
                  }}
                >
                  {String(Math.floor(nowMinutes / 60)).padStart(2, "0")}:
                  {String(nowMinutes % 60).padStart(2, "0")}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
