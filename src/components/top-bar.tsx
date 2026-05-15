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
import { SearchPopover } from "@/components/search-popover";
import { NotificationsPanel } from "@/components/notifications-panel";
import { UserMenu } from "@/components/user-menu";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mutual exclusivity — only one popover open at a time
  function openSearch() {
    setNotifOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(true);
  }
  function openNotifs() {
    setSearchOpen(false);
    setUserMenuOpen(false);
    setNotifOpen((v) => !v);
  }
  function openUserMenu() {
    setSearchOpen(false);
    setNotifOpen(false);
    setUserMenuOpen((v) => !v);
  }

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
          data-search-trigger
          onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]"
          aria-label="Search"
        >
          <Search size={15} strokeWidth={1.6} />
        </button>

        <button
          data-notifications-trigger
          onClick={openNotifs}
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

        <button
          data-user-menu-trigger
          onClick={openUserMenu}
          className="h-8 pl-2 pr-1.5 flex items-center gap-1.5 rounded hover:bg-[var(--hover)] text-sm"
        >
          <span>{currentUser.name}</span>
          <ChevronDown
            size={12}
            className={cn(
              "text-[var(--text-subtle)] transition-transform",
              userMenuOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <SearchPopover open={searchOpen} onClose={() => setSearchOpen(false)} />
      <UserMenu open={userMenuOpen} onClose={() => setUserMenuOpen(false)} />
    </header>
  );
}
