import { TopBar } from "@/components/top-bar";
import { EmptyState } from "@/components/empty-state";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <>
      <TopBar title="Search" />
      <EmptyState
        icon={Search}
        title="Full search results"
        description="A dedicated search experience with saved searches, filters, and recents. For now, use the search modal in the top bar."
      />
    </>
  );
}
