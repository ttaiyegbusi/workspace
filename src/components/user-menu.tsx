"use client";

import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Gift,
  User as UserIcon,
  LifeBuoy,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { currentUser } from "@/data/workspace";
import { LetterAvatar } from "@/components/letter-avatar";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function UserMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-user-menu-trigger]")
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

  function toggleTheme() {
    if (!mounted) return;
    document.documentElement.classList.add("transitioning");
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(
      () => document.documentElement.classList.remove("transitioning"),
      250,
    );
  }

  if (!open) return null;

  // Email shown in the header — using a Gmail-format display for consistency
  // with the user menu's portrait of "your account"
  const displayEmail = "aiyegbusitope@gmail.com";

  return (
    <div
      ref={panelRef}
      className="absolute top-12 right-3 md:right-4 z-50 w-[240px] bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-[var(--shadow-lg)] py-1 overflow-hidden"
    >
      {/* User header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5">
        <LetterAvatar letter={currentUser.initial} size="lg" filled />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {currentUser.fullName}
          </div>
          <div className="text-xs text-[var(--text-muted)] truncate">
            {displayEmail}
          </div>
        </div>
      </div>

      <Divider />

      <MenuItem icon={Circle} label="Set Status" />
      <MenuItem icon={Gift} label="Affiliates Program" />
      <MenuItem icon={UserIcon} label="Account" />
      <MenuItem icon={LifeBuoy} label="Support" />

      <Divider />

      <button
        onClick={toggleTheme}
        className="w-full px-3 h-9 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left"
      >
        {mounted && theme === "dark" ? (
          <Sun size={14} className="text-[var(--text-muted)]" />
        ) : (
          <Moon size={14} className="text-[var(--text-muted)]" />
        )}
        <span>{mounted && theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>

      <Divider />

      <MenuItem icon={LogOut} label="Sign Out" />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
}: {
  icon: typeof UserIcon;
  label: string;
}) {
  return (
    <button className="w-full px-3 h-9 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
      <Icon size={14} className="text-[var(--text-muted)]" strokeWidth={1.6} />
      <span>{label}</span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--border)] mx-2 my-1" />;
}
