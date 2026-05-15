"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  Inbox as InboxIcon,
  Users,
  FileText,
  Timer,
  Trophy,
  Lock,
  ChevronDown,
  Plus,
  PanelLeft,
  ArrowLeftRight,
  PlusCircle,
  User,
  Zap,
  HelpCircle,
  BookOpen,
  Lightbulb,
  LogOut,
  MoreHorizontal,
  Copy,
  Heart,
  Eye,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { workspace } from "@/data/workspace";
import { LetterAvatar } from "@/components/letter-avatar";
import { CreateTeamModal } from "@/components/create-team-modal";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/inbox", label: "Inbox", icon: InboxIcon },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/timesheet", label: "Timesheet", icon: Timer },
  { href: "/goals", label: "Goals", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useStore((s) => s.sidebarCollapsed);
  const mobileOpen = useStore((s) => s.mobileSidebarOpen);
  const setMobileSidebar = useStore((s) => s.setMobileSidebar);

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileSidebar(false)}
      />

      <aside
        className={cn(
          "fixed md:relative z-40 h-full flex flex-col bg-[var(--bg)] border-r border-[var(--border)] transition-all duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          sidebarCollapsed ? "md:w-[60px]" : "md:w-[240px]",
          "w-[260px]",
        )}
      >
        <SidebarTop />
        <SidebarNav collapsed={sidebarCollapsed} pathname={pathname} />
        <SidebarTeams
          collapsed={sidebarCollapsed}
          pathname={pathname}
          onCreateTeam={() => setCreateOpen(true)}
        />
      </aside>

      <CreateTeamModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}

function SidebarTop() {
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const setMobileSidebar = useStore((s) => s.setMobileSidebar);

  return (
    <div className="h-14 flex items-center px-3 border-b border-[var(--border)] gap-2">
      <button
        onClick={() => {
          toggleSidebar();
          setMobileSidebar(false);
        }}
        className="h-8 w-8 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)] flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={16} />
      </button>

      {/* Warehouse Logo */}
      <div className="h-6 w-6 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-xs">W</span>
      </div>
    </div>
  );
}

function SidebarNav({
  collapsed,
  pathname,
}: {
  collapsed: boolean;
  pathname: string;
}) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="px-3 pt-3 pb-1">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <SectionHeader label="WORKSPACE" collapsed={collapsed} />

      <nav className="px-2 flex flex-col gap-px">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "h-8 flex items-center gap-2.5 px-2 rounded text-sm transition-colors",
                active
                  ? "bg-[var(--selected)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]",
                collapsed && "md:justify-center md:px-0",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={15} className="flex-shrink-0" strokeWidth={1.6} />
              <span className={cn(collapsed && "md:hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarTeams({
  collapsed,
  pathname,
  onCreateTeam,
}: {
  collapsed: boolean;
  pathname: string;
  onCreateTeam: () => void;
}) {
  const teams = useStore((s) => s.teams);

  return (
    <div className="mt-4 flex-1 min-h-0 flex flex-col">
      <SectionHeader
        label="TEAMS"
        collapsed={collapsed}
        action
        onAction={onCreateTeam}
      />
      <nav className="px-2 flex flex-col gap-px overflow-y-auto scroll-thin">
        {teams.map((t) => {
          const active = pathname === `/teams/${t.id}`;
          return (
            <TeamItem
              key={t.id}
              team={t}
              active={active}
              collapsed={collapsed}
            />
          );
        })}
      </nav>
    </div>
  );
}

function TeamItem({
  team,
  active,
  collapsed,
}: {
  team: any;
  active: boolean;
  collapsed: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateTeamColor = useStore((s) => s.updateTeamColor);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setColorPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#64748b",
  ];

  return (
    <div ref={menuRef} className="relative">
      <div className="flex items-center gap-1 group">
        <Link
          href={`/teams/${team.id}`}
          className={cn(
            "flex-1 h-8 flex items-center gap-2.5 px-2 rounded text-sm transition-colors",
            active
              ? "bg-[var(--selected)] text-[var(--text)]"
              : "text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]",
            collapsed && "md:justify-center md:px-0",
          )}
        >
          <LetterAvatar
            letter={team.initial}
            size="xs"
            style={
              team.color
                ? { backgroundColor: team.color, borderColor: team.color }
                : {}
            }
          />
          <span className={cn("flex-1 truncate", collapsed && "md:hidden")}>
            {team.name}
          </span>
          {team.locked && !collapsed && (
            <Lock
              size={11}
              className="text-[var(--text-subtle)] flex-shrink-0"
            />
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-6 w-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--hover)] text-[var(--text-muted)] transition-opacity"
            title="Team options"
          >
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {menuOpen && !collapsed && (
        <div className="absolute top-full left-0 mt-1 w-[200px] z-50 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-lg)] py-1">
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Rename</span>
          </button>
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <Copy size={14} />
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
            className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left relative"
          >
            <span>Color & Icon</span>
            <ChevronDown size={12} className="ml-auto" />
          </button>
          {colorPickerOpen && (
            <div className="px-3 py-2 bg-[var(--surface-2)] border-t border-[var(--border)]">
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      updateTeamColor(team.id, color);
                      setMenuOpen(false);
                      setColorPickerOpen(false);
                    }}
                    className="h-6 w-6 rounded border-2 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        team.color === color ? "#000" : "transparent",
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          <Divider />
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Templates</span>
          </button>
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Automations</span>
          </button>
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Custom Fields</span>
          </button>
          <Divider />
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <Heart size={14} />
            <span>Add to Favorites</span>
          </button>
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <Eye size={14} />
            <span>Hide Team</span>
          </button>
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Duplicate</span>
          </button>
          <Divider />
          <button className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left">
            <span>Sharing and Permissions</span>
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  label,
  collapsed,
  action = false,
  onAction,
}: {
  label: string;
  collapsed: boolean;
  action?: boolean;
  onAction?: () => void;
}) {
  if (collapsed)
    return (
      <div className="h-3 mt-3 mb-1 md:border-t md:border-[var(--border)] md:mx-2" />
    );
  return (
    <div className="px-4 mt-3 mb-1 flex items-center justify-between text-[10px] tracking-[0.12em] text-[var(--text-subtle)] font-medium">
      <span>{label}</span>
      {action && (
        <button
          onClick={onAction}
          className="h-5 w-5 flex items-center justify-center rounded hover:bg-[var(--hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
          aria-label={`Add ${label.toLowerCase()}`}
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-9 flex items-center gap-2 px-1.5 rounded hover:bg-[var(--hover)] transition-colors",
          collapsed && "md:justify-center md:px-0",
        )}
      >
        <LetterAvatar letter={workspace.initial} size="sm" filled />
        <span
          className={cn(
            "text-sm font-medium truncate",
            collapsed && "md:hidden",
          )}
        >
          {workspace.name}
        </span>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-strong)] text-[var(--text-muted)] tracking-wide",
            collapsed && "md:hidden",
          )}
        >
          {workspace.role}
        </span>
        <ChevronDown
          size={12}
          className={cn(
            "ml-auto text-[var(--text-subtle)] transition-transform",
            open && "rotate-180",
            collapsed && "md:hidden",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-[260px] z-50 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-lg)] py-1"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="px-3 py-2.5 flex items-center gap-2.5">
            <LetterAvatar letter={workspace.initial} size="lg" filled />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {workspace.name}
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate">
                {workspace.email}
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-strong)] text-[var(--text-muted)]">
              {workspace.plan}
            </span>
          </div>

          <Divider />
          <MenuItem icon={ArrowLeftRight} label="Switch Account" />
          <MenuItem icon={PlusCircle} label="Create new" />
          <Divider />
          <MenuItem icon={User} label="Account" />
          <MenuItem icon={Zap} label="Upgrade" />
          <Divider />
          <MenuItem icon={HelpCircle} label="Ask a question" />
          <MenuItem icon={BookOpen} label="Help topics" />
          <MenuItem icon={Lightbulb} label="Share Feedback" />
          <Divider />
          <MenuItem icon={LogOut} label="Log out" />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: typeof Home; label: string }) {
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
