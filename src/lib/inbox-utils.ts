import type { InboxItem } from "@/lib/types";

export type InboxGroup = {
  label: string;
  items: InboxItem[];
};

export function groupInbox(items: InboxItem[]): InboxGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const groups = new Map<string, InboxItem[]>();

  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long" });

  function bucket(item: InboxItem) {
    const d = new Date(item.receivedAt);
    if (d >= today) return "Today";
    if (d >= sevenDaysAgo) return "Last 7 days";
    return monthFmt.format(d);
  }

  // preserve original (newest-first) order
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );

  for (const item of sorted) {
    const key = bucket(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}
