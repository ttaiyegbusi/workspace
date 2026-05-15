"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, X } from "lucide-react";
import { Modal } from "@/components/modal";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LetterAvatar } from "@/components/letter-avatar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateTeamModal({ open, onClose }: Props) {
  const addTeam = useStore((s) => s.addTeam);
  const router = useRouter();
  const [name, setName] = useState("");
  const [initial, setInitial] = useState("");
  const [locked, setLocked] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setInitial("");
      setLocked(false);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  // Auto-derive initial from the first letter of the name unless the user has
  // explicitly typed their own.
  const [initialEdited, setInitialEdited] = useState(false);
  useEffect(() => {
    if (!initialEdited) {
      setInitial(name.charAt(0).toUpperCase());
    }
  }, [name, initialEdited]);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = addTeam({
      name: trimmed,
      initial: (initial || trimmed.charAt(0)).toUpperCase(),
      locked,
    });
    onClose();
    router.push(`/teams/${id}`);
  }

  return (
    <Modal open={open} onClose={onClose} align="center">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <h2 className="text-sm font-medium">Create a new team</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Preview of the team as it will appear in the sidebar */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
          <LetterAvatar letter={initial || "?"} size="xs" />
          <span
            className={cn(
              "text-sm flex-1 truncate",
              !name && "text-[var(--text-subtle)]",
            )}
          >
            {name || "Team name"}
          </span>
          {locked && (
            <Lock size={11} className="text-[var(--text-subtle)]" />
          )}
        </div>

        <Field label="Team name">
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="e.g. Operations"
            className="w-full h-9 px-3 text-sm bg-[var(--surface-2)] rounded border border-transparent focus:border-[var(--border-strong)] outline-none placeholder:text-[var(--text-subtle)]"
          />
        </Field>

        <Field label="Initial" hint="One letter shown in the sidebar.">
          <input
            value={initial}
            maxLength={1}
            onChange={(e) => {
              setInitial(e.target.value.toUpperCase());
              setInitialEdited(true);
            }}
            className="w-12 h-9 px-3 text-sm text-center bg-[var(--surface-2)] rounded border border-transparent focus:border-[var(--border-strong)] outline-none uppercase"
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={locked}
            onClick={() => setLocked((v) => !v)}
            className={cn(
              "relative h-[18px] w-8 rounded-full transition-colors flex-shrink-0",
              locked ? "bg-[var(--text)]" : "bg-[var(--border-strong)]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform",
                locked ? "translate-x-[15px]" : "translate-x-0.5",
              )}
            />
          </button>
          <span className="text-sm">
            Private team
            <span className="block text-xs text-[var(--text-muted)]">
              Only members you invite can see this team.
            </span>
          </span>
        </label>
      </div>

      <div className="px-5 py-3 flex items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--bg)]">
        <button
          onClick={onClose}
          className="h-8 px-3 text-sm rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className={cn(
            "h-8 px-4 text-sm rounded font-medium transition-colors",
            name.trim()
              ? "bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
              : "bg-[var(--surface-2)] text-[var(--text-subtle)] cursor-not-allowed",
          )}
        >
          Create team
        </button>
      </div>
    </Modal>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[12px] font-medium mb-1.5">{label}</div>
      {children}
      {hint && (
        <div className="mt-1 text-[11px] text-[var(--text-subtle)]">{hint}</div>
      )}
    </div>
  );
}
