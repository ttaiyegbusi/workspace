"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import {
  User as UserIcon,
  Flag,
  Calendar,
  Tag,
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Pill } from "@/components/pill";
import { PriorityPill } from "@/components/priority-pill";
import { LetterAvatar } from "@/components/letter-avatar";
import { useStore } from "@/lib/store";
import { teams, currentUser } from "@/data/workspace";
import { docs } from "@/data/docs";
import { cn, formatDate, initials, timeAgo } from "@/lib/utils";

type Tab = "overview" | "getting-started" | "board" | "list-view";

export default function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const team = teams.find((t) => t.id === teamId);
  if (!team) notFound();

  const [tab, setTab] = useState<Tab>("overview");

  return (
    <>
      <TopBar title={team.name} />

      <div className="border-b border-[var(--border)] px-5 md:px-8 overflow-x-auto scroll-thin">
        <div className="flex gap-5 md:gap-7">
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
      </div>

      {tab === "overview" && <Overview teamId={team.id} />}
      {tab === "getting-started" && <ComingSoonInline label="Getting Started" />}
      {tab === "board" && <ComingSoonInline label="Board" />}
      {tab === "list-view" && <ComingSoonInline label="List View" />}
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
          We're focusing on making the Overview tab feel exactly right before
          shipping this one.
        </p>
      </div>
    </div>
  );
}

function Overview({ teamId }: { teamId: string }) {
  const tasks = useStore((s) => s.tasks.filter((t) => t.teamId === teamId));
  const selectedTaskId = useStore((s) => s.selectedTaskByTeam[teamId]);
  const addTask = useStore((s) => s.addTask);
  const updateTaskTitle = useStore((s) => s.updateTaskTitle);

  const task = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  // New task creation state (the "Type in here" inline field)
  const [draftTitle, setDraftTitle] = useState("");
  const router = useRouter();

  function handleDraftKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && draftTitle.trim()) {
      e.preventDefault();
      const title = draftTitle.trim();
      setDraftTitle("");
      addTask(teamId, title, currentUser.fullName);
    }
  }

  if (!task) {
    // Edge case — if no tasks at all
    return (
      <div className="flex-1 overflow-y-auto scroll-thin px-5 md:px-10 py-6">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={handleDraftKey}
          placeholder="Type in here"
          className="w-full text-2xl md:text-[28px] tracking-tight font-medium leading-tight bg-transparent border-0 outline-none placeholder:text-[var(--text-subtle)] py-1"
        />
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Press <Kbd>Enter</Kbd> to create your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
      {/* Main */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="px-5 md:px-10 py-6 md:py-8 max-w-3xl">
          {/* New-task drafting field, sits above the current task */}
          <div className="mb-6">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={handleDraftKey}
              placeholder="Type in here"
              className="w-full text-[18px] md:text-[20px] tracking-tight font-medium leading-snug bg-transparent border-0 outline-none placeholder:text-[var(--text-subtle)] py-2 border-b border-transparent focus:border-[var(--border)]"
            />
            {draftTitle.length > 0 && (
              <div className="mt-1.5 text-xs text-[var(--text-subtle)]">
                Press <Kbd>Enter</Kbd> to create a new task
              </div>
            )}
          </div>

          {/* Current task title (editable in-place) */}
          <TaskTitle
            key={task.id}
            value={task.title}
            onChange={(v) => updateTaskTitle(task.id, v)}
          />

          {/* Meta grid */}
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
                  <span className="text-[13px] text-[var(--text-subtle)]">—</span>
                )}
                {task.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </MetaRow>
            <MetaRow icon={Paperclip} label="Docs">
              <div className="flex flex-wrap gap-1.5">
                {task.attachedDocIds.length === 0 && (
                  <span className="text-[13px] text-[var(--text-subtle)]">—</span>
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
          </dl>

          {/* Description */}
          <div className="mt-8 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--text)]">
            {task.description ||
              "Add a description for this task — what should be delivered, why it matters, and who's involved."}
          </div>

          {/* Task switcher (when there are multiple tasks for a team) */}
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

      {/* Right side panel — Activities + Comments */}
      <RightPanel taskId={task.id} />
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 text-[10px] rounded border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-muted)]">
      {children}
    </kbd>
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

  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] lg:border-l border-t lg:border-t-0 border-[var(--border)] flex flex-col min-h-0 bg-[var(--bg)]">
      {/* Activities */}
      <div className="px-5 lg:px-6 pt-5 pb-3">
        <h3 className="text-[13px] font-medium mb-3">Activities</h3>
        <ul className="space-y-3">
          {task.activities.slice(-5).map((a) => (
            <li key={a.id} className="flex items-start gap-2.5">
              <LetterAvatar
                letter={a.authorName.charAt(0).toUpperCase()}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-tight">
                  <span className="font-medium">{a.authorName}</span>{" "}
                  <span className="text-[var(--text-muted)]">{a.action}</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                  {timeAgo(a.createdAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Comments */}
      <div className="border-t border-[var(--border)] flex-1 min-h-0 flex flex-col">
        <div className="px-5 lg:px-6 pt-4 pb-2">
          <h3 className="text-[13px] font-medium">Comments</h3>
        </div>
        <ul className="flex-1 overflow-y-auto scroll-thin px-5 lg:px-6 pb-3 space-y-4">
          {task.comments.length === 0 && (
            <li className="text-xs text-[var(--text-subtle)]">
              No comments yet — kick off the conversation.
            </li>
          )}
          {task.comments.map((c) => (
            <li key={c.id} className="flex items-start gap-2.5">
              <LetterAvatar
                letter={c.authorName.charAt(0).toUpperCase()}
                size="sm"
              />
              <div className="min-w-0 flex-1">
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
              </div>
            </li>
          ))}
        </ul>

        {/* Composer */}
        <div className="border-t border-[var(--border)] p-3 flex items-center gap-2">
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
              "h-9 px-3 rounded text-[13px] flex items-center gap-1.5 font-medium transition-colors",
              draft.trim()
                ? "bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
                : "bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed",
            )}
          >
            <span>Send</span>
            <Send size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}
