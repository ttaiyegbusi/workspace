"use client";

import { MoreHorizontal, Search, MessageSquare, Menu, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { currentUser } from "@/data/workspace";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode; // optional right-side content (e.g. "Invite New +")
};

export function TopBar({ title, children }: Props) {
  const setMobileSidebar = useStore((s) => s.setMobileSidebar);

  return (
    <header className="h-14 border-b border-[var(--border)] flex items-center px-4 md:px-6 gap-3 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileSidebar(true)}
        className="md:hidden h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[15px] font-medium truncate">{title}</h1>
        <button
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="More"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {children}
        <button
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="Search"
        >
          <Search size={15} strokeWidth={1.6} />
        </button>
        <button
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="Messages"
        >
          <MessageSquare size={15} strokeWidth={1.6} />
        </button>
        <button
          className="h-8 pl-2 pr-1.5 flex items-center gap-1.5 rounded hover:bg-[var(--hover)] text-sm"
        >
          <span>{currentUser.name}</span>
          <ChevronDown size={12} className="text-[var(--text-subtle)]" />
        </button>
      </div>
    </header>
  );
}
