import { TopBar } from "@/components/top-bar";
import { EmptyState } from "@/components/empty-state";
import { Home as HomeIcon } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <TopBar title="Home" />
      <EmptyState
        icon={HomeIcon}
        title="Your workspace home"
        description="A personalised digest of your tasks, recent docs, and what your teams are shipping. We're putting the finishing touches on this view."
      />
    </>
  );
}
