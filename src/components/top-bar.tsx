"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

type Props = {
  title: string;
  children?: ReactNode;
  /** When provided, clicking the `···` button calls this. Used for team pages. */
  onMoreClick?: () => void;
  /** When true, double-clicking the title (or programmatic trigger via startEditingTitle ref) makes it editable. */
  editableTitle?: boolean;
  /** Called when an inline-edited title commits */
  onTitleChange?: (next: string) => void;
  /** Ref-like callback the parent can use to programmatically start editing */
  registerStartEditing?: (fn: () => void) => void;
  /** Whether the `···` button is currently in pressed state */
  morePressed?: boolean;
};

export function TopBar({
  title,
  children,
  onMoreClick,
  editableTitle = false,
  onTitleChange,
  registerStartEditing,
  morePressed = false,
}: Props) {
  const setMobileSidebar = useStore((s) => s.setMobileSidebar);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Inline title editing
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Allow parent to start editing programmatically (used by team menu "Rename")
  useEffect(() => {
    if (registerStartEditing) {
      registerStartEditing(() => {
        setDraftTitle(title);
        setEditing(true);
        setTimeout(() => {
          titleInputRef.current?.focus();
          titleInputRef.current?.select();
        }, 30);
      });
    }
  }, [registerStartEditing, title]);

  // Sync draftTitle when title prop changes (e.g. after rename commit)
  useEffect(() => {
    if (!editing) setDraftTitle(title);
  }, [title, editing]);

  function commitTitle() {
    const next = draftTitle.trim();
    if (next && next !== title) {
      onTitleChange?.(next);
    } else {
      setDraftTitle(title);
    }
    setEditing(false);
  }

  function cancelTitle() {
    setDraftTitle(title);
    setEditing(false);
  }

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
        {editing ? (
          <input
            ref={titleInputRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") cancelTitle();
            }}
            className="text-[15px] font-medium bg-transparent border border-[var(--border-strong)] focus:outline-none focus:ring-0 rounded px-1.5 py-0.5 -my-0.5 min-w-[120px]"
            maxLength={60}
          />
        ) : (
          <h1
            onDoubleClick={() => {
              if (editableTitle) {
                setDraftTitle(title);
                setEditing(true);
                setTimeout(() => {
                  titleInputRef.current?.focus();
                  titleInputRef.current?.select();
                }, 30);
              }
            }}
            className={cn(
              "text-[15px] font-medium truncate",
              editableTitle && "cursor-text",
            )}
            title={editableTitle ? "Double-click to rename" : undefined}
          >
            {title}
          </h1>
        )}
        <button
          data-team-menu-trigger
          onClick={onMoreClick}
          className={cn(
            "h-6 w-6 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)]",
            morePressed && "bg-[var(--hover)] text-[var(--text)]",
          )}
          aria-label="More options"
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
