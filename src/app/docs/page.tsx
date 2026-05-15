"use client";

import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { DocIcon } from "@/components/doc-icon";
import { docs } from "@/data/docs";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const [tab, setTab] = useState<"all">("all");

  return (
    <>
      <TopBar title="Documents" />

      <div className="px-5 md:px-8 mt-4 border-b border-[var(--border)]">
        <div className="flex gap-7">
          <button
            className={cn(
              "py-3 text-[13px] border-b-2 -mb-[1px] whitespace-nowrap",
              tab === "all"
                ? "border-[var(--text)] text-[var(--text)] font-medium"
                : "border-transparent text-[var(--text-muted)]",
            )}
          >
            All <span className="text-[var(--text-subtle)] text-xs ml-1">[ {docs.length} ]</span>
          </button>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto scroll-thin">
        {docs.map((d) => (
          <li
            key={d.id}
            className="px-5 md:px-8 py-3 flex items-center gap-3 md:gap-4 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
          >
            <DocIcon type={d.type} />
            <span className="text-[13px] flex-1 min-w-0 truncate">
              {d.name}
            </span>
            <span className="hidden sm:block text-[13px] text-[var(--text-muted)] w-[80px] tabular-nums">
              {d.size}
            </span>
            <span className="hidden md:block text-[13px] text-[var(--text-muted)] w-[200px] text-right truncate">
              Uploaded {formatDate(d.uploadedAt)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
