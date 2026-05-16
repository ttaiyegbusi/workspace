"use client";

import { use, useEffect, useRef, useState } from "react";
import {
  User as UserIcon,
  Flag,
  Calendar,
  Tag,
  Paperclip,
  Smile,
  ExternalLink,
  Users as UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Pill } from "@/components/pill";
import { PriorityPill } from "@/components/priority-pill";
import { LetterAvatar } from "@/components/letter-avatar";
import { SharePopover } from "@/components/share-popover";
import { ShareSuccessModal } from "@/components/share-success-modal";
import { TeamMenu } from "@/components/team-menu";
import { useStore } from "@/lib/store";
import { currentUser } from "@/data/workspace";
import { docs } from "@/data/docs";
import { cn, formatDate, formatTime, timeAgo } from "@/lib/utils";

type Tab = "overview" | "getting-started" | "board" | "list-view";

export default function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const teams = useStore((s) => s.teams);
  const team = teams.find((t) => t.id === teamId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [tab, setTab] = useState<Tab>("overview");

  // Share state lives at the page level since the Share button is in the tab bar
  const [shareOpen, setShareOpen] = useState(false);
  const [successLabel, setSuccessLabel] = useState<string | null>(null);

  // Team context menu (triggered by the `···` in the top bar)
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const renameTeam = useStore((s) => s.renameTeam);

  // Hook the TopBar's inline-edit trigger so the Team menu's "Rename" item can fire it
  const startEditingRef = useRef<(() => void) | null>(null);

  // Pull stable references from the store, then derive in render.
  // (Filtering inside a Zustand selector returns a new array each call,
  // which triggers infinite re-renders.)
  const allTasks = useStore((s) => s.tasks);
  const selectedTaskByTeam = useStore((s) => s.selectedTaskByTeam);

  const tasks = team ? allTasks.filter((t) => t.teamId === team.id) : [];
  const selectedTaskId = team ? (selectedTaskByTeam[team.id] ?? null) : null;
  const activeTask = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  // Graceful render when the team genuinely doesn't exist (e.g. typo'd URL).
  // We avoid calling notFound() from a client component since that throws
  // during render and gets obscured in production builds.
  if (mounted && !team) {
    return (
      <>
        <TopBar title="Team not found" />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <h2 className="text-[15px] font-medium mb-1.5">
              We couldn&rsquo;t find that team
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              The team you&rsquo;re looking for may have been removed, or the
              URL might be wrong.
            </p>
            <Link
              href="/teams"
              className="inline-flex h-8 items-center px-3 rounded text-[13px] font-medium bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
            >
              Back to teams
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={team?.name ?? ""}
        editableTitle={!!team}
        onTitleChange={(next) => team && renameTeam(team.id, next)}
        registerStartEditing={(fn) => {
          startEditingRef.current = fn;
        }}
        onMoreClick={() => setTeamMenuOpen((v) => !v)}
        morePressed={teamMenuOpen}
      />

      {team && (
        <TeamMenu
          open={teamMenuOpen}
          onClose={() => setTeamMenuOpen(false)}
          teamId={team.id}
          onStartRename={() => startEditingRef.current?.()}
          onOpenShare={() => setShareOpen(true)}
        />
      )}

      <div className="relative border-b border-[var(--border)] px-5 md:px-8 flex items-center">
        <div className="flex gap-5 md:gap-7 overflow-x-auto scroll-thin flex-1">
          <TabBtn
            label="Overview"
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          />
          <TabBtn
            label="Getting Started"
            active={tab === "getting-started"}
            onClick={() => setTab("getting-started")}
          />
          <TabBtn
            label="Board"
            active={tab === "board"}
            onClick={() => setTab("board")}
          />
          <TabBtn
            label="List View"
            active={tab === "list-view"}
            onClick={() => setTab("list-view")}
          />
        </div>

        {/* Share button — only shown when there's an active task to share */}
        {tab === "overview" && activeTask && (
          <button
            data-share-trigger
            onClick={() => setShareOpen((v) => !v)}
            className="ml-3 flex items-center gap-1.5 h-8 px-2.5 rounded text-[13px] text-[var(--text)] hover:bg-[var(--hover)] flex-shrink-0"
          >
            <span>Share</span>
            <ExternalLink size={11} strokeWidth={1.6} />
          </button>
        )}

        {activeTask && (
          <SharePopover
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            taskId={activeTask.id}
            onSent={(label) => setSuccessLabel(label)}
          />
        )}
      </div>

      {tab === "overview" && team && <Overview teamId={team.id} />}
      {tab === "getting-started" && (
        <ComingSoonInline label="Getting Started" />
      )}
      {tab === "board" && <ComingSoonInline label="Board" />}
      {tab === "list-view" && <ComingSoonInline label="List View" />}

      <ShareSuccessModal
        open={successLabel !== null}
        label={successLabel ?? ""}
        onClose={() => setSuccessLabel(null)}
      />
    </>
  );
}

function TabBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 text-[13px] border-b-2 -mb-[1px] whitespace-nowrap transition-colors",
        active
          ? "border-[var(--text)] text-[var(--text)] font-medium"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]",
      )}
    >
      {label}
    </button>
  );
}

function ComingSoonInline({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-[10px] tracking-[0.18em] text-[var(--text-subtle)] mb-2">
          {label.toUpperCase()}
        </div>
        <div className="text-[15px] font-medium mb-1.5">Coming soon</div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          We&rsquo;re focusing on making the Overview tab feel exactly right
          before shipping this one.
        </p>
      </div>
    </div>
  );
}

function Overview({ teamId }: { teamId: string }) {
  const allTasks = useStore((s) => s.tasks);
  const selectedTaskByTeam = useStore((s) => s.selectedTaskByTeam);
  const updateTaskTitle = useStore((s) => s.updateTaskTitle);

  const tasks = allTasks.filter((t) => t.teamId === teamId);
  const selectedTaskId = selectedTaskByTeam[teamId] ?? null;
  const task = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  if (!task) {
    return <EmptyTeamForm teamId={teamId} />;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="px-5 md:px-10 py-6 md:py-8 max-w-3xl">
          <TaskTitle
            key={task.id}
            value={task.title}
            onChange={(v) => updateTaskTitle(task.id, v)}
          />

          <dl className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-x-4 gap-y-3 mt-6 text-sm">
            <MetaRow icon={UserIcon} label="Created by">
              <span className="text-[13px]">{task.createdBy}</span>
            </MetaRow>
            <MetaRow icon={Flag} label="Priority">
              <PriorityPill priority={task.priority} />
            </MetaRow>
            <MetaRow icon={Calendar} label="Due Date">
              <span className="text-[13px]">{formatDate(task.dueDate)}</span>
            </MetaRow>
            <MetaRow icon={Tag} label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {task.tags.length === 0 && (
                  <span className="text-[13px] text-[var(--text-subtle)]">
                    —
                  </span>
                )}
                {task.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </MetaRow>
            <MetaRow icon={Paperclip} label="Docs">
              <div className="flex flex-wrap gap-1.5">
                {task.attachedDocIds.length === 0 && (
                  <span className="text-[13px] text-[var(--text-subtle)]">
                    —
                  </span>
                )}
                {task.attachedDocIds.map((id) => {
                  const d = docs.find((x) => x.id === id);
                  if (!d) return null;
                  return (
                    <Pill key={id} className="gap-1">
                      <span>{d.name}</span>
                      <span className="text-[var(--text-subtle)]">×</span>
                    </Pill>
                  );
                })}
              </div>
            </MetaRow>
            {(task.peopleAccess.length > 0 || task.teamAccess.length > 0) && (
              <MetaRow icon={UsersIcon} label="Shared with">
                <SharedWith
                  people={task.peopleAccess}
                  teams={task.teamAccess}
                />
              </MetaRow>
            )}
          </dl>

          <div className="mt-8 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--text)]">
            {task.description ||
              "Add a description for this task — what should be delivered, why it matters, and who's involved."}
          </div>

          {tasks.length > 1 && (
            <div className="mt-10 border-t border-[var(--border)] pt-5">
              <div className="text-[10px] tracking-[0.18em] text-[var(--text-subtle)] mb-3">
                MORE TASKS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tasks
                  .filter((t) => t.id !== task.id)
                  .map((t) => (
                    <SwitchToTaskBtn key={t.id} teamId={teamId} taskId={t.id}>
                      {t.title}
                    </SwitchToTaskBtn>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <RightPanel taskId={task.id} />
    </div>
  );
}

// ---------- Shared with: stack of recipient avatars + count overflow ----------

function SharedWith({
  people,
  teams,
}: {
  people: { id: string; name: string; email: string }[];
  teams: { id: string; name: string; initial: string }[];
}) {
  const MAX_DISPLAY = 5;
  // Combine into a single visual stack — people first, then teams
  const combined: Array<{ key: string; initial: string; label: string }> = [
    ...people.map((p) => ({
      key: `p-${p.id}`,
      initial: p.name.charAt(0).toUpperCase(),
      label: `${p.name} (${p.email})`,
    })),
    ...teams.map((t) => ({
      key: `t-${t.id}`,
      initial: t.initial,
      label: t.name,
    })),
  ];
  const visible = combined.slice(0, MAX_DISPLAY);
  const overflow = combined.length - visible.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-1.5">
        {visible.map((v) => (
          <div
            key={v.key}
            title={v.label}
            className="ring-2 ring-[var(--bg)] rounded-[3px]"
          >
            <LetterAvatar letter={v.initial} size="sm" />
          </div>
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-2 text-[12px] text-[var(--text-muted)]">
          +{overflow} more
        </span>
      )}
    </div>
  );
}

// ---------- Empty team form (unchanged from previous build) ----------

function EmptyTeamForm({ teamId }: { teamId: string }) {
  const addTask = useStore((s) => s.addTask);
  const [subject, setSubject] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [dueDate, setDueDate] = useState("");

  function commit() {
    const title = subject.trim();
    if (!title) return;
    addTask(teamId, title, createdBy.trim() || currentUser.fullName);
    setSubject("");
    setCreatedBy("");
    setDueDate("");
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="px-5 md:px-10 py-6 md:py-8 max-w-3xl">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
            placeholder="Enter a Subject"
            className="w-full text-2xl md:text-[28px] tracking-tight font-medium leading-tight bg-transparent border-0 outline-none placeholder:text-[var(--text-subtle)] py-1 -ml-0.5"
          />

          <dl className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-x-4 gap-y-3 mt-6 text-sm">
            <MetaRow icon={UserIcon} label="Created by">
              <input
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="Type here"
                className="w-full h-7 text-[13px] bg-transparent outline-none placeholder:text-[var(--text-subtle)]"
              />
            </MetaRow>
            <MetaRow icon={Flag} label="Priority">
              <PlaceholderBtn>Add</PlaceholderBtn>
            </MetaRow>
            <MetaRow icon={Calendar} label="Due Date">
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Type here"
                className="w-full h-7 text-[13px] bg-transparent outline-none placeholder:text-[var(--text-subtle)]"
              />
            </MetaRow>
            <MetaRow icon={Tag} label="Tags">
              <PlaceholderBtn>Add</PlaceholderBtn>
            </MetaRow>
            <MetaRow icon={Paperclip} label="Docs">
              <PlaceholderBtn>Add</PlaceholderBtn>
            </MetaRow>
          </dl>

          {subject.trim().length > 0 && (
            <div className="mt-8 flex items-center gap-2">
              <button
                onClick={commit}
                className="h-8 px-3 text-[13px] rounded font-medium bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
              >
                Create task
              </button>
              <span className="text-xs text-[var(--text-subtle)]">
                or press Enter
              </span>
            </div>
          )}
        </div>
      </div>

      <EmptyRightPanel />
    </div>
  );
}

function PlaceholderBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="text-[13px] text-[var(--text-subtle)] hover:text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
    >
      {children}
    </button>
  );
}

function EmptyRightPanel() {
  const createdAt = new Date();
  const timestamp = `${createdAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} at ${formatTime(createdAt.toISOString())}`;

  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] lg:border-l border-t lg:border-t-0 border-[var(--border)] flex flex-col min-h-0 bg-[var(--bg)]">
      <div className="px-5 lg:px-6 pt-5 pb-3">
        <h3 className="text-[13px] font-medium mb-3">Activities</h3>
        <ul>
          <ActivityItem
            authorName={currentUser.fullName}
            action="created a Task"
            timestamp={timestamp}
            isLast
          />
        </ul>
      </div>

      <div className="border-t border-[var(--border)] flex-1 min-h-0 flex flex-col">
        <div className="px-5 lg:px-6 pt-4 pb-2">
          <h3 className="text-[13px] font-medium">Comments</h3>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 text-center">
          <div className="text-xs text-[var(--text-subtle)] leading-relaxed">
            Comments will appear here once you create a task and the team starts
            discussing it.
          </div>
        </div>

        <div className="border-t border-[var(--border)] p-3 flex items-center gap-2 opacity-50">
          <input
            disabled
            placeholder="Add a comment"
            className="flex-1 h-9 px-3 text-[13px] bg-[var(--surface-2)] rounded outline-none placeholder:text-[var(--text-subtle)] cursor-not-allowed"
          />
          <button
            disabled
            className="h-9 w-9 flex items-center justify-center rounded text-[var(--text-muted)]"
            aria-label="Add emoji"
          >
            <Smile size={15} />
          </button>
          <button
            disabled
            className="h-9 px-4 rounded text-[13px] font-medium bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}

function ActivityItem({
  authorName,
  action,
  timestamp,
  isLast = false,
}: {
  authorName: string;
  action: string;
  timestamp: string;
  isLast?: boolean;
}) {
  return (
    <li className="relative flex items-start gap-2.5 pb-4 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[11px] top-7 bottom-1 w-px bg-[var(--border)]"
        />
      )}
      <LetterAvatar
        letter={authorName.charAt(0).toUpperCase()}
        size="sm"
        className="relative z-[1]"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-tight">
          <span className="font-medium">{authorName}</span>{" "}
          <span className="text-[var(--text-muted)]">{action}</span>
        </div>
        <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
          {timestamp}
        </div>
      </div>
    </li>
  );
}

function TaskTitle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  return (
    <input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local.trim() && local !== value) onChange(local.trim());
        else setLocal(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setLocal(value);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-full text-2xl md:text-[28px] tracking-tight font-medium leading-tight bg-transparent border-0 outline-none py-1 -ml-0.5"
    />
  );
}

function SwitchToTaskBtn({
  teamId,
  taskId,
  children,
}: {
  teamId: string;
  taskId: string;
  children: React.ReactNode;
}) {
  const selectTask = useStore((s) => s.selectTask);
  return (
    <button
      onClick={() => selectTask(teamId, taskId)}
      className="px-2.5 py-1 rounded border border-[var(--border-strong)] text-xs hover:bg-[var(--hover)] text-[var(--text-muted)] hover:text-[var(--text)] truncate max-w-[260px]"
    >
      {children}
    </button>
  );
}

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="flex items-center gap-2 text-[13px] text-[var(--text-muted)] py-1">
        <Icon size={13} strokeWidth={1.6} />
        <span>{label}</span>
      </dt>
      <dd className="flex items-center min-h-[24px] py-1">{children}</dd>
    </>
  );
}

function RightPanel({ taskId }: { taskId: string }) {
  const task = useStore((s) => s.tasks.find((t) => t.id === taskId))!;
  const addComment = useStore((s) => s.addComment);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function send() {
    const value = draft.trim();
    if (!value) return;
    addComment(taskId, value, currentUser.fullName);
    setDraft("");
    inputRef.current?.focus();
  }

  const recentActivities = task.activities.slice(-5);

  // Padding constants applied identically to every row in both Activities and Comments.
  const ROW_PX = "px-3";
  const SECTION_HEADER_PX = "px-3";

  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] lg:border-l border-t lg:border-t-0 border-[var(--border)] flex flex-col min-h-0 bg-[var(--bg)]">
      {/* Single scroll container for both lists so padding is uniform */}
      <div className="flex-1 overflow-y-auto scroll-thin min-h-0">
        {/* Activities */}
        <section className="pt-5 pb-3">
          <h3 className={cn("text-[13px] font-medium mb-3", SECTION_HEADER_PX)}>
            Activities
          </h3>
          <ul>
            {recentActivities.map((a, i) => (
              <ListRow
                key={a.id}
                paddingX={ROW_PX}
                avatar={
                  <LetterAvatar
                    letter={a.authorName.charAt(0).toUpperCase()}
                    size="sm"
                    className="relative z-[1]"
                  />
                }
                threadLine={i !== recentActivities.length - 1}
                bodyPaddingBottom="pb-4 last:pb-0"
              >
                <div className="text-[13px] leading-tight">
                  <span className="font-medium">{a.authorName}</span>{" "}
                  <span className="text-[var(--text-muted)]">{a.action}</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                  {timeAgo(a.createdAt)}
                </div>
              </ListRow>
            ))}
          </ul>
        </section>

        {/* Comments */}
        <section className="border-t border-[var(--border)] pt-4 pb-3">
          <h3 className={cn("text-[13px] font-medium mb-3", SECTION_HEADER_PX)}>
            Comments
          </h3>
          <ul>
            {task.comments.length === 0 && (
              <li className={cn("text-xs text-[var(--text-subtle)]", ROW_PX)}>
                No comments yet — kick off the conversation.
              </li>
            )}
            {task.comments.map((c) => (
              <ListRow
                key={c.id}
                paddingX={ROW_PX}
                avatar={
                  <LetterAvatar
                    letter={c.authorName.charAt(0).toUpperCase()}
                    size="sm"
                    className="relative z-[1]"
                  />
                }
                bodyPaddingBottom="pb-4 last:pb-0"
              >
                <div className="flex items-center gap-1.5 text-[12px]">
                  <span className="font-medium">{c.authorName}</span>
                  <span className="text-[var(--text-subtle)]">•</span>
                  <span className="text-[var(--text-subtle)]">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <div className="text-[13px] mt-1 leading-relaxed text-[var(--text)]">
                  {c.body}
                </div>
              </ListRow>
            ))}
          </ul>
        </section>
      </div>

      {/* Composer */}
      <div className="border-t border-[var(--border)] px-3 py-3 flex items-center gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Add a comment"
          className="flex-1 h-9 px-3 text-[13px] bg-[var(--surface-2)] rounded outline-none placeholder:text-[var(--text-subtle)]"
        />
        <button
          className="h-9 w-9 flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--hover)]"
          aria-label="Add emoji"
        >
          <Smile size={15} />
        </button>
        <button
          onClick={send}
          disabled={!draft.trim()}
          className={cn(
            "h-9 px-4 rounded text-[13px] font-medium transition-colors",
            draft.trim()
              ? "bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
              : "bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed",
          )}
        >
          Send
        </button>
      </div>
    </aside>
  );
}

/** Single primitive used by both Activities and Comments so they stay aligned.
 *  Renders: paddingX on the li, avatar, optional thread line (Activities only),
 *  and the body content next to the avatar. */
function ListRow({
  paddingX,
  avatar,
  threadLine = false,
  bodyPaddingBottom,
  children,
}: {
  paddingX: string;
  avatar: React.ReactNode;
  threadLine?: boolean;
  bodyPaddingBottom?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "relative flex items-start gap-2",
        paddingX,
        bodyPaddingBottom,
      )}
    >
      {threadLine && (
        <span
          aria-hidden
          className="absolute left-[calc(1.25rem+11px)] lg:left-[calc(1.5rem+11px)] top-7 bottom-1 w-px bg-[var(--border)]"
        />
      )}
      {avatar}
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}
