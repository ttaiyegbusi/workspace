"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Link2,
  Plus,
  Palette,
  FileText,
  Workflow,
  ListPlus,
  Star,
  EyeOff,
  Copy as CopyIcon,
  Check,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { teamColors } from "@/data/team-colors";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  teamId: string;
  /** Called when user picks "Rename" — parent should switch the title into inline-edit mode */
  onStartRename: () => void;
  /** Called when user picks "Sharing and Permissions" — parent should open the share popover */
  onOpenShare: () => void;
};

type Pane = "main" | "color";

export function TeamMenu({
  open,
  onClose,
  teamId,
  onStartRename,
  onOpenShare,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const team = useStore((s) => s.teams.find((t) => t.id === teamId));
  const updateColor = useStore((s) => s.updateTeamColor);

  const [pane, setPane] = useState<Pane>("main");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setPane("main");
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-team-menu-trigger]")
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

  if (!open || !team) return null;

  async function copyTeamLink() {
    if (!team) return;
    try {
      await navigator.clipboard.writeText(
        `https://www.workspace.app/teams/${team.id}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  }

  function pickColor(bg: string | undefined) {
    updateColor(team!.id, bg);
  }

  return (
    <div
      ref={ref}
      className="absolute top-12 left-4 md:left-auto md:right-auto md:translate-x-0 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-[var(--shadow-lg)] py-1 overflow-hidden"
      style={{ width: 220 }}
    >
      {pane === "main" && (
        <>
          <Item
            icon={Pencil}
            label="Rename"
            onClick={() => {
              onStartRename();
              onClose();
            }}
          />
          <Item
            icon={Link2}
            label={copied ? "Copied!" : "Copy Link"}
            onClick={(e) => {
              e.stopPropagation();
              copyTeamLink();
            }}
            keepOpenOnClick
          />

          <Divider />

          <Item icon={Plus} label="Create New" hasSubmenu />
          <Item
            icon={Palette}
            label="Color & Icon"
            hasSubmenu
            onClick={() => setPane("color")}
            keepOpenOnClick
          />
          <Item icon={FileText} label="Templates" hasSubmenu />
          <Item icon={Workflow} label="Automations" />
          <Item icon={ListPlus} label="Custom Fields" />

          <Divider />

          <Item icon={Star} label="Add to Favourites" />
          <Item icon={EyeOff} label="Hide Team" />

          <Divider />

          <Item icon={CopyIcon} label="Duplicate" />

          <div className="px-1.5 pt-1 pb-1">
            <button
              onClick={() => {
                onOpenShare();
                onClose();
              }}
              className="w-full px-2.5 h-8 flex items-center justify-start rounded text-sm font-medium bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
            >
              Sharing and Permissions
            </button>
          </div>
        </>
      )}

      {pane === "color" && (
        <ColorPickerPane
          currentColor={team.color}
          onBack={() => setPane("main")}
          onPick={(c) => pickColor(c)}
        />
      )}
    </div>
  );
}

function ColorPickerPane({
  currentColor,
  onBack,
  onPick,
}: {
  currentColor: string | undefined;
  onBack: () => void;
  onPick: (color: string | undefined) => void;
}) {
  return (
    <div className="py-1">
      <button
        onClick={onBack}
        className="w-full px-3 h-8 flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover)]"
      >
        <ChevronRight size={11} className="rotate-180" />
        <span>Back</span>
      </button>

      <div className="px-3 pt-2">
        <div className="text-[11px] tracking-[0.06em] text-[var(--text-muted)] mb-2">
          Color
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {teamColors.map((c) => {
            const isActive = currentColor?.toLowerCase() === c.bg.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => onPick(c.bg)}
                aria-label={c.label}
                title={c.label}
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center transition-transform",
                  isActive && "ring-2 ring-offset-2 ring-[var(--text)] ring-offset-[var(--surface)]",
                )}
                style={{ backgroundColor: c.bg }}
              >
                {isActive && <Check size={11} color={c.fg} />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPick(undefined)}
          className="w-full text-left px-1 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  onClick,
  hasSubmenu = false,
  keepOpenOnClick = false,
}: {
  icon: typeof Pencil;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  hasSubmenu?: boolean;
  keepOpenOnClick?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        if (!keepOpenOnClick && !hasSubmenu) {
          // For pure stubs, just close-and-noop is fine via parent; here we just invoke handler
        }
        onClick?.(e);
      }}
      className="w-full px-3 h-8 flex items-center gap-2.5 text-sm hover:bg-[var(--hover)] text-[var(--text)] text-left"
    >
      <Icon size={13} className="text-[var(--text-muted)]" strokeWidth={1.6} />
      <span className="flex-1">{label}</span>
      {hasSubmenu && (
        <ChevronRight size={11} className="text-[var(--text-subtle)]" />
      )}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--border)] mx-2 my-1" />;
}
