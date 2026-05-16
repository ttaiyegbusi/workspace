"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { X } from "lucide-react";

export type ToastAction = {
  /** Label shown for the action (e.g. "Undo", "View message") */
  label: string;
  /** Called when the user clicks the action. Toast auto-closes after. */
  onClick: () => void;
};

type ToastInput = {
  message: string;
  actions?: ToastAction[];
  /** Auto-dismiss after this many ms. Default 5000. */
  duration?: number;
};

type ToastState = {
  open: boolean;
  message: string;
  actions: ToastAction[];
  duration: number;
  /** Bump on every show() so the auto-dismiss effect re-runs. */
  nonce: number;
  show: (t: ToastInput) => void;
  dismiss: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: "",
  actions: [],
  duration: 5000,
  nonce: 0,
  show: ({ message, actions = [], duration = 5000 }) =>
    set((s) => ({
      open: true,
      message,
      actions,
      duration,
      nonce: s.nonce + 1,
    })),
  dismiss: () => set({ open: false }),
}));

export function ToastHost() {
  const open = useToastStore((s) => s.open);
  const message = useToastStore((s) => s.message);
  const actions = useToastStore((s) => s.actions);
  const duration = useToastStore((s) => s.duration);
  const nonce = useToastStore((s) => s.nonce);
  const dismiss = useToastStore((s) => s.dismiss);

  // Auto-dismiss
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(t);
    // Re-run if a new toast is shown (nonce changes)
  }, [open, duration, nonce, dismiss]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      // Top-center, above everything. Doesn't intercept clicks outside the card.
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      <div
        // The card itself catches clicks for action buttons
        className="pointer-events-auto flex items-center gap-3 pl-4 pr-2 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-[var(--shadow-lg)] min-w-[280px] max-w-[460px] animate-toast-in"
      >
        <span className="text-[13px] text-[var(--text)] flex-1 truncate">
          {message}
        </span>
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => {
              a.onClick();
              dismiss();
            }}
            className="text-[13px] font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline px-1.5"
          >
            {a.label}
          </button>
        ))}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="h-7 w-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
