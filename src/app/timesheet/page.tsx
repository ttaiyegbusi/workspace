import { TopBar } from "@/components/top-bar";
import { EmptyState } from "@/components/empty-state";
import { Timer } from "lucide-react";

export default function TimesheetPage() {
  return (
    <>
      <TopBar title="Timesheet" />
      <EmptyState
        icon={Timer}
        title="Track your time"
        description="Log hours against tasks and projects, see where the week went, and export a timesheet for billing or payroll."
      />
    </>
  );
}
