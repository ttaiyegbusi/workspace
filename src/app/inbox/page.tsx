"use client";

import { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  Plus,
  X,
  Reply as ReplyIcon,
  Archive,
  Trash2,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Pill } from "@/components/pill";
import { LetterAvatar } from "@/components/letter-avatar";
import { inbox } from "@/data/inbox";
import { groupInbox } from "@/lib/inbox-utils";
import { useStore } from "@/lib/store";
import { useToastStore } from "@/components/toast";
import { currentUser } from "@/data/workspace";
import { cn, formatTime, timeAgo } from "@/lib/utils";
import type { InboxItem, InboxReply } from "@/lib/types";

const groups = groupInbox(inbox);

export default function InboxPage() {
  const selectedId = useStore((s) => s.selectedInboxId);
  const selectInbox = useStore((s) => s.selectInbox);
  const selected = inbox.find((i) => i.id === selectedId);

  // Escape to close detail
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedId) selectInbox(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
        {/* List — full width by default, narrows when detail is open */}
        <div
          className={cn(
            "overflow-y-auto scroll-thin",
            // Mobile: hide list entirely if detail is showing
            selected ? "hidden lg:block" : "block",
            // Desktop: full width with no selection, ~48% with selection
            selected
              ? "lg:flex-[0_0_48%] xl:flex-[0_0_44%] border-r border-[var(--border)]"
              : "flex-1",
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
        {selected && (
          <div
            className={cn(
              "flex-1 lg:flex-[1_1_auto] overflow-y-auto scroll-thin bg-[var(--surface)]",
            )}
          >
            <InboxDetail
              key={selected.id}
              item={selected}
              onClose={() => selectInbox(null)}
            />
          </div>
        )}
      </div>
    </>
  );
}

function InboxRow({
  item,
  selected,
  onSelect,
}: {
  item: InboxItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        onClick={onSelect}
        className={cn(
          "w-full text-left px-5 md:px-6 py-3 flex items-center gap-3 border-b border-[var(--border)] transition-colors",
          selected ? "bg-[var(--selected)]" : "hover:bg-[var(--hover)]",
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
  onClose,
}: {
  item: InboxItem;
  onClose: () => void;
}) {
  // Pull the stable map reference, then index into it during render.
  // (Returning `... ?? []` directly from the selector creates a new array
  // every call and causes an infinite re-render loop.)
  const repliesMap = useStore((s) => s.inboxRepliesByItemId);
  const repliesForThisItem = repliesMap[item.id] ?? [];
  const addInboxReply = useStore((s) => s.addInboxReply);
  const removeInboxReply = useStore((s) => s.removeInboxReply);
  const showToast = useToastStore((s) => s.show);

  // Combine seeded replies + user replies into one chronological list
  const allReplies: InboxReply[] = [...item.replies, ...repliesForThisItem];

  // Auto-scroll to the latest reply when one appears (e.g. after Send)
  const lastReplyRef = useRef<HTMLDivElement>(null);

  function handleSent(text: string) {
    const id = addInboxReply(item.id, text);

    // Scroll to the newly-added reply after layout
    setTimeout(() => {
      lastReplyRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 30);

    showToast({
      message: "Message sent",
      actions: [
        {
          label: "Undo",
          onClick: () => {
            removeInboxReply(item.id, id);
          },
        },
        {
          label: "View message",
          onClick: () => {
            // Scroll to it
            setTimeout(() => {
              lastReplyRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 30);
          },
        },
      ],
    });
  }

  return (
    <article className="max-w-3xl mx-auto px-5 md:px-8 py-6">
      <div className="flex items-center gap-2 mb-5">
        <Pill>{item.category}</Pill>
        <span className="text-xs text-[var(--text-subtle)] tabular-nums">
          {timeAgo(item.receivedAt)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn label="Reply">
            <ReplyIcon size={14} />
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
          <IconBtn label="Close" onClick={onClose}>
            <X size={14} />
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

      {/* Replies thread */}
      {allReplies.length > 0 && (
        <div className="mt-10">
          {allReplies.map((reply, i) => {
            const isLast = i === allReplies.length - 1;
            return (
              <div
                key={reply.id}
                ref={isLast ? lastReplyRef : undefined}
                className="border-t border-[var(--border)] pt-5 mb-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <LetterAvatar
                    letter={reply.authorName.charAt(0).toUpperCase()}
                    size="lg"
                    filled
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {reply.authorName}{" "}
                      <span className="text-[var(--text-muted)] font-normal text-xs">
                        (You)
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {timeAgo(reply.sentAt)}
                    </div>
                  </div>
                </div>
                <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap text-[var(--text)]">
                  {reply.body}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply composer */}
      <div className="mt-10 mb-2">
        <ReplyComposer sender={item.sender} onSent={handleSent} />
      </div>
    </article>
  );
}

function ReplyComposer({
  sender,
  onSent,
}: {
  sender: string;
  onSent: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function expand() {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 30);
  }

  function send() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSent(trimmed);
    setBody("");
    setExpanded(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      send();
    }
    if (e.key === "Escape") {
      if (body.trim().length === 0) {
        setExpanded(false);
        (e.target as HTMLTextAreaElement).blur();
      }
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={expand}
        className="w-full text-left px-4 py-3 rounded-md border border-[var(--border-strong)] text-[13px] text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition-colors"
      >
        <span className="flex items-center gap-2">
          <ReplyIcon size={13} className="text-[var(--text-subtle)]" />
          <span>Reply to {sender}…</span>
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-md border border-[var(--border-strong)] bg-[var(--surface)] overflow-hidden">
      <div className="px-4 pt-2.5 pb-1.5 flex items-center gap-2 border-b border-[var(--border)] text-[12px]">
        <span className="text-[var(--text-muted)]">To:</span>
        <span className="text-[var(--text)]">{sender}</span>
        <ChevronDown size={11} className="text-[var(--text-subtle)] ml-0.5" />
      </div>
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type your reply…"
        rows={5}
        className="w-full px-4 py-3 text-[14px] leading-relaxed bg-transparent border-none outline-none focus:outline-none focus:ring-0 placeholder:text-[var(--text-subtle)] resize-none"
      />
      <div className="px-4 py-2.5 flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg)]">
        <span className="text-[11px] text-[var(--text-subtle)]">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded border border-[var(--border-strong)] text-[10px] bg-[var(--surface-2)]">
            ⌘ + Enter
          </kbd>{" "}
          to send
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBody("");
              setExpanded(false);
            }}
            className="h-7 px-3 text-[12px] rounded text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            Discard
          </button>
          <button
            onClick={send}
            disabled={!body.trim()}
            className={cn(
              "h-7 px-4 rounded text-[12px] font-medium transition-colors",
              body.trim()
                ? "bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
                : "bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed",
            )}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="h-8 w-8 flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
    >
      {children}
    </button>
  );
}
