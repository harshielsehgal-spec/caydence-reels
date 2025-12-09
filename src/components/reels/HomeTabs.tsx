export type TabType = "for-you" | "trending" | "challenges";

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
    <div className="flex items-center justify-center gap-6 px-4 py-2 border-b border-border/30">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative text-sm font-semibold transition-colors pb-2 ${
            activeTab === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default HomeTabs;
