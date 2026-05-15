"use client";

import { useEffect, useState } from "react";
import { Paperclip, Plus, ArrowLeft, Reply, Archive, Trash2, MoreHorizontal } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Pill } from "@/components/pill";
import { LetterAvatar } from "@/components/letter-avatar";
import { inbox } from "@/data/inbox";
import { currentUser } from "@/data/workspace";
import { groupInbox } from "@/lib/inbox-utils";
import { useStore } from "@/lib/store";
import { cn, formatTime, timeAgo } from "@/lib/utils";

const groups = groupInbox(inbox);

export default function InboxPage() {
  const selectedId = useStore((s) => s.selectedInboxId);
  const selectInbox = useStore((s) => s.selectInbox);
  const selected = inbox.find((i) => i.id === selectedId);

  // Default to first item on desktop, but not mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedId && window.innerWidth >= 1024) {
      selectInbox(inbox[0]!.id);
    }
  }, [selectedId, selectInbox]);

  return (
    <>
      <TopBar title="Inbox">
        <button className="hidden md:flex h-8 px-3 items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          <span>Create New</span>
          <Plus size={13} />
        </button>
      </TopBar>

      <div className="flex-1 min-h-0 flex">
        {/* List */}
        <div
          className={cn(
            "flex-1 lg:flex-[0_0_55%] xl:flex-[0_0_52%] border-r border-[var(--border)] overflow-y-auto scroll-thin",
            selected && "hidden lg:block",
          )}
        >
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-5 md:px-6 pt-4 pb-2 text-[13px] font-medium text-[var(--text-muted)] border-b border-[var(--border)]">
                {g.label}
              </div>
              <ul>
                {g.items.map((item) => (
                  <InboxRow
                    key={item.id}
                    item={item}
                    selected={item.id === selectedId}
                    onSelect={() => selectInbox(item.id)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div
          className={cn(
            "flex-1 lg:flex-[1_1_auto] overflow-y-auto scroll-thin bg-[var(--surface)]",
            !selected && "hidden lg:block",
          )}
        >
          {selected ? (
            <InboxDetail
              key={selected.id}
              item={selected}
              onBack={() => selectInbox(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div>
                <div className="text-sm text-[var(--text-muted)]">
                  Select a message
                </div>
                <div className="text-xs text-[var(--text-subtle)] mt-1">
                  Pick something from the list to read it here.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InboxRow({
  item,
  selected,
  onSelect,
}: {
  item: (typeof inbox)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        onClick={onSelect}
        className={cn(
          "w-full text-left px-5 md:px-6 py-3 flex items-center gap-3 border-b border-[var(--border)] transition-colors",
          selected
            ? "bg-[var(--selected)]"
            : "hover:bg-[var(--hover)]",
          !item.read && "font-medium",
        )}
      >
        <input
          type="checkbox"
          className="h-3.5 w-3.5 accent-[var(--text)] flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-[13px] w-[140px] md:w-[170px] truncate flex-shrink-0">
          {item.sender}
        </span>
        <span className="text-[13px] flex-1 min-w-0 truncate text-[var(--text)]">
          <span className={cn(!item.read ? "" : "text-[var(--text-muted)]")}>
            {item.subject}
          </span>
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          {item.hasAttachment && (
            <Paperclip
              size={12}
              className="text-[var(--text-subtle)]"
              strokeWidth={1.5}
            />
          )}
          <Pill>{item.category}</Pill>
          <span className="text-xs text-[var(--text-subtle)] tabular-nums hidden sm:inline w-[60px] text-right">
            {formatTime(item.receivedAt)}
          </span>
        </span>
      </button>
    </li>
  );
}

function InboxDetail({
  item,
  onBack,
}: {
  item: (typeof inbox)[number];
  onBack: () => void;
}) {
  return (
    <article className="max-w-3xl mx-auto px-5 md:px-8 py-6">
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={onBack}
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)]"
        >
          <ArrowLeft size={16} />
        </button>
        <Pill>{item.category}</Pill>
        <span className="text-xs text-[var(--text-subtle)] tabular-nums">
          {timeAgo(item.receivedAt)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn label="Reply">
            <Reply size={14} />
          </IconBtn>
          <IconBtn label="Archive">
            <Archive size={14} />
          </IconBtn>
          <IconBtn label="Delete">
            <Trash2 size={14} />
          </IconBtn>
          <IconBtn label="More">
            <MoreHorizontal size={14} />
          </IconBtn>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-medium leading-snug mb-5 tracking-tight">
        {item.subject}
      </h2>

      <div className="flex items-center gap-3 pb-5 border-b border-[var(--border)]">
        <LetterAvatar letter={item.sender.charAt(0).toUpperCase()} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{item.sender}</div>
          <div className="text-xs text-[var(--text-muted)] truncate">
            to {`<${currentUser.email}>`}
          </div>
        </div>
      </div>

      <div className="pt-6 text-[14.5px] leading-relaxed whitespace-pre-wrap text-[var(--text)]">
        {item.body}
      </div>

      {item.hasAttachment && (
        <div className="mt-8 border border-[var(--border)] rounded-md p-3 flex items-center gap-3 max-w-sm">
          <div className="h-9 w-9 rounded bg-[var(--surface-2)] flex items-center justify-center">
            <Paperclip size={14} className="text-[var(--text-muted)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">attachment.pdf</div>
            <div className="text-xs text-[var(--text-muted)]">412 KB</div>
          </div>
          <button className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
            Download
          </button>
        </div>
      )}
    </article>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      title={label}
      className="h-8 w-8 flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
    >
      {children}
    </button>
  );
}
