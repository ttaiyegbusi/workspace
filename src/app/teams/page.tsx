"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Pill } from "@/components/pill";
import { LetterAvatar } from "@/components/letter-avatar";
import { members, memberCounts } from "@/data/members";
import { cn, initials } from "@/lib/utils";

type Tab = "All" | "Active" | "Inactive" | "Pending";

export default function TeamsPage() {
  const [tab, setTab] = useState<Tab>("All");

  const filtered =
    tab === "All"
      ? members
      : tab === "Pending"
        ? members.filter((m) => m.status === "Pending")
        : members.filter((m) => m.status === tab);

  return (
    <>
      <TopBar title="Teams" />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="px-5 md:px-8 pt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm font-medium">Members</div>
          <button className="h-8 px-3 flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            <span>Invite New</span>
            <Plus size={13} />
          </button>
        </div>

        <div className="px-5 md:px-8 mt-3 border-b border-[var(--border)] overflow-x-auto scroll-thin">
          <div className="flex gap-5 md:gap-7">
            <TabBtn
              label="All"
              count={memberCounts.all}
              active={tab === "All"}
              onClick={() => setTab("All")}
            />
            <TabBtn
              label="Active"
              count={memberCounts.active}
              active={tab === "Active"}
              onClick={() => setTab("Active")}
            />
            <TabBtn
              label="Inactive"
              count={memberCounts.inactive}
              active={tab === "Inactive"}
              onClick={() => setTab("Inactive")}
            />
            <TabBtn
              label="Pending Invitation"
              count={memberCounts.pending}
              active={tab === "Pending"}
              onClick={() => setTab("Pending")}
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto scroll-thin">
          {filtered.map((m) => (
            <li
              key={m.id}
              className="px-5 md:px-8 py-3.5 flex items-center gap-3 md:gap-4 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
            >
              <LetterAvatar letter={initials(m.name).charAt(0)} size="md" />
              <span className="text-[13px] flex-1 min-w-0 truncate font-medium">
                {m.name}
              </span>
              <span className="hidden md:block text-[13px] text-[var(--text-muted)] w-[260px] truncate">
                {m.email}
              </span>
              <Pill className="w-[80px] justify-center">
                <span className="capitalize">{m.status}</span>
              </Pill>
              <span className="hidden lg:block text-[13px] text-[var(--text-muted)] w-[200px] truncate text-right">
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function TabBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 text-[13px] flex items-center gap-1.5 border-b-2 -mb-[1px] whitespace-nowrap transition-colors",
        active
          ? "border-[var(--text)] text-[var(--text)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]",
      )}
    >
      <span>{label}</span>
      <span className="text-[var(--text-subtle)] text-xs tabular-nums">
        [ {count} ]
      </span>
    </button>
  );
}
