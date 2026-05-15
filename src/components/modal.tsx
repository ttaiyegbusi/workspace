"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Alignment of the modal. 'center' for create-team etc; 'top' for search palette */
  align?: "center" | "top";
};

export function Modal({
  open,
  onClose,
  children,
  className,
  align = "center",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[60] flex justify-center px-4",
        align === "center" ? "items-center" : "items-start pt-[10vh]",
      )}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-lg)] overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
