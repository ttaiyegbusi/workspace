"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { currentUser } from "@/data/workspace";
import { SearchModal } from "@/components/search-modal";
import { NotificationsPanel } from "@/components/notifications-panel";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export function TopBar({ title, children }: Props) {
  const setMobileSidebar = useStore((s) => s.setMobileSidebar);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="relative h-14 border-b border-[var(--border)] flex items-center px-4 md:px-6 gap-3 flex-shrink-0">
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
          onClick={() => setSearchOpen(true)}
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="Search"
        >
          <Search size={15} strokeWidth={1.6} />
        </button>

        <button
          data-notifications-trigger
          onClick={() => setNotifOpen((v) => !v)}
          className="relative h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.6} />
          {unread > 0 && (
            <span
              className={cn(
                "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--text)]",
              )}
              aria-label={`${unread} unread notifications`}
            />
          )}
        </button>

        <button className="h-8 pl-2 pr-1.5 flex items-center gap-1.5 rounded hover:bg-[var(--hover)] text-sm">
          <span>{currentUser.name}</span>
          <ChevronDown size={12} className="text-[var(--text-subtle)]" />
        </button>
      </div>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
