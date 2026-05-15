"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Trash2, Copy, Check, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { LetterAvatar } from "@/components/letter-avatar";
import { cn, isGmail } from "@/lib/utils";
import type { SharePermission } from "@/lib/types";

const PERMISSIONS: SharePermission[] = ["View", "Comment", "Edit"];

type Props = {
  open: boolean;
  onClose: () => void;
  taskId: string;
  /** Called after a successful new-share send so the parent can show the success modal */
  onSent: (email: string) => void;
};

export function SharePopover({ open, onClose, taskId, onSent }: Props) {
  const task = useStore((s) => s.tasks.find((t) => t.id === taskId));
  const addPerson = useStore((s) => s.addPersonAccess);
  const removePerson = useStore((s) => s.removePersonAccess);
  const updatePerson = useStore((s) => s.updatePersonPermission);
  const removeTeam = useStore((s) => s.removeTeamAccess);
  const updateTeamPerm = useStore((s) => s.updateTeamAccessPermission);

  const [emailInput, setEmailInput] = useState("");
  const [defaultPerm, setDefaultPerm] = useState<SharePermission>("View");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setEmailInput("");
      setCopied(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-share-trigger]")
      ) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!task || !open) return null;

  const valid = isGmail(emailInput);

  function send() {
    if (!valid) return;
    const email = emailInput.trim().toLowerCase();
    const localPart = email.split("@")[0]!;
    const name = localPart
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    addPerson(taskId, { name, email, permission: defaultPerm });
    onSent(email);
    setEmailInput("");
  }

  const publicLink = `https://www.workspace.app/t/${taskId}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers — silently no-op
    }
  }

  return (
    <>
      {/* Mobile-only backdrop */}
      <div
        onClick={onClose}
        className="md:hidden fixed inset-0 z-40 bg-black/40"
      />

      <div
        ref={ref}
        className={cn(
          // Mobile = bottom sheet
          "fixed bottom-0 left-0 right-0 z-50 md:absolute md:top-12 md:right-4 md:bottom-auto md:left-auto",
          "md:w-[360px] md:max-w-[calc(100vw-1.5rem)]",
          "bg-[var(--surface)] border border-[var(--border)] md:rounded-md rounded-t-xl shadow-[var(--shadow-lg)]",
          "max-h-[80vh] md:max-h-[calc(100vh-5rem)]",
          "flex flex-col overflow-hidden",
        )}
      >
        {/* Email input row */}
        <div className="p-3 flex items-center gap-2 border-b border-[var(--border)]">
          <input
            ref={inputRef}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Email address"
            className="flex-1 h-8 px-3 text-[13px] bg-[var(--surface-2)] rounded outline-none placeholder:text-[var(--text-subtle)]"
            inputMode="email"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <PermissionDropdown
            value={defaultPerm}
            onChange={setDefaultPerm}
            compact
          />
          <button
            onClick={send}
            disabled={!valid}
            className={cn(
              "h-8 px-3 rounded text-[13px] font-medium transition-colors",
              valid
                ? "bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
                : "bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed",
            )}
          >
            Send
          </button>
        </div>

        {/* Validation hint when invalid */}
        {emailInput.length > 0 && !valid && (
          <div className="px-3 py-1.5 text-[11px] text-[var(--text-muted)] bg-[var(--bg)] border-b border-[var(--border)]">
            Enter a Gmail address (must end in @gmail.com).
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scroll-thin">
          {/* People with Access */}
          <section className="px-3 pt-3">
            <h4 className="text-[12px] text-[var(--text-muted)] mb-2">
              People with Access
            </h4>
            <ul className="space-y-0.5">
              {task.peopleAccess.length === 0 && (
                <li className="px-2 py-2 text-[12px] text-[var(--text-subtle)]">
                  No one's been shared yet.
                </li>
              )}
              {task.peopleAccess.map((p) => (
                <PersonRow
                  key={p.id}
                  initial={p.name.charAt(0).toUpperCase()}
                  name={p.name}
                  sub={p.email}
                  permission={p.permission}
                  onPermissionChange={(perm) =>
                    updatePerson(taskId, p.id, perm)
                  }
                  onRemove={() => removePerson(taskId, p.id)}
                />
              ))}
            </ul>
          </section>

          {/* Teams with Access */}
          <section className="px-3 pt-4 pb-3">
            <h4 className="text-[12px] text-[var(--text-muted)] mb-2">
              Teams with Access
            </h4>
            <ul className="space-y-0.5">
              {task.teamAccess.length === 0 && (
                <li className="px-2 py-2 text-[12px] text-[var(--text-subtle)]">
                  No teams have access.
                </li>
              )}
              {task.teamAccess.map((ta) => (
                <PersonRow
                  key={ta.id}
                  initial={ta.initial}
                  name={ta.name}
                  permission={ta.permission}
                  onPermissionChange={(perm) =>
                    updateTeamPerm(taskId, ta.id, perm)
                  }
                  onRemove={() => removeTeam(taskId, ta.id)}
                />
              ))}
            </ul>
          </section>
        </div>

        {/* Public link */}
        <div className="px-3 py-2.5 border-t border-[var(--border)] flex items-center gap-2 bg-[var(--bg)]">
          <span className="text-[12px] text-[var(--text-muted)] flex-1 truncate">
            {publicLink}
          </span>
          <button
            onClick={copyLink}
            className="h-7 px-2.5 rounded border border-[var(--border-strong)] text-[12px] text-[var(--text)] hover:bg-[var(--hover)] flex items-center gap-1.5 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check size={11} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function PersonRow({
  initial,
  name,
  sub,
  permission,
  onPermissionChange,
  onRemove,
}: {
  initial: string;
  name: string;
  sub?: string;
  permission: SharePermission;
  onPermissionChange: (p: SharePermission) => void;
  onRemove: () => void;
}) {
  return (
    <li className="group flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--hover)] transition-colors">
      <LetterAvatar letter={initial} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] truncate">{name}</div>
        {sub && (
          <div className="text-[11px] text-[var(--text-muted)] truncate">
            {sub}
          </div>
        )}
      </div>
      <PermissionDropdown value={permission} onChange={onPermissionChange} />
      <button
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="h-6 w-6 flex items-center justify-center rounded text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </li>
  );
}

function PermissionDropdown({
  value,
  onChange,
  compact = false,
}: {
  value: SharePermission;
  onChange: (p: SharePermission) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] rounded transition-colors",
          compact ? "h-7 px-1.5" : "h-6 px-1.5",
        )}
      >
        <span>{value}</span>
        <ChevronDown size={11} className="text-[var(--text-subtle)]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[110px] z-10 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] py-1">
          {PERMISSIONS.map((p) => (
            <button
              key={p}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-[12px] flex items-center justify-between hover:bg-[var(--hover)]",
                value === p && "font-medium",
              )}
            >
              <span>{p}</span>
              {value === p && <Check size={11} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
