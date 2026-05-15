"use client";

import { Check } from "lucide-react";
import { Modal } from "@/components/modal";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export function ShareSuccessModal({ open, onClose, email }: Props) {
  return (
    <Modal open={open} onClose={onClose} align="center" className="max-w-sm">
      <div className="px-6 pt-7 pb-6 text-center">
        <div className="mx-auto h-11 w-11 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mb-4">
          <Check size={18} className="text-[var(--text)]" strokeWidth={2} />
        </div>
        <h2 className="text-[15px] font-medium mb-1.5">Shared successfully</h2>
        <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
          {email} now has access to this task. They&rsquo;ll get an email shortly.
        </p>
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg)] flex justify-end">
        <button
          onClick={onClose}
          autoFocus
          className="h-8 px-5 rounded text-[13px] font-medium bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
