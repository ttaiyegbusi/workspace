import { TopBar } from "@/components/top-bar";
import { EmptyState } from "@/components/empty-state";
import { Trophy } from "lucide-react";

export default function GoalsPage() {
  return (
    <>
      <TopBar title="Goals" />
      <EmptyState
        icon={Trophy}
        title="Set and track goals"
        description="Define quarterly objectives at the workspace and team level, link them to tasks, and watch progress roll up automatically."
      />
    </>
  );
}
