import { cn } from "@/lib/utils";

type TabType = "for-you" | "trending" | "challenges";

interface HomeTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "for-you", label: "For You" },
  { id: "trending", label: "Trending" },
  { id: "challenges", label: "Challenges" },
];

const HomeTabs = ({ activeTab, onTabChange }: HomeTabsProps) => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 border-b border-border/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default HomeTabs;
export type { TabType };
