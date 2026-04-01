import { useState } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";

const sportChips = [
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "gym", label: "Gym", emoji: "🏋️" },
  { id: "mobility", label: "Mobility", emoji: "🧘" },
];

const tabs = ["Users", "Challenges", "Sports", "Reels"];

const demoResults = {
  Users: [
    { id: "1", name: "Rohit Sharma", avatar: "RS", subtitle: "Cricket Coach" },
    { id: "2", name: "Virat Kohli", avatar: "VK", subtitle: "Fitness Expert" },
    { id: "3", name: "MS Dhoni", avatar: "MD", subtitle: "Cricket Legend" },
  ],
  Challenges: [
    { id: "1", title: "Cover Drive Master", participants: 234, sport: "Cricket" },
    { id: "2", title: "Free Kick Pro", participants: 156, sport: "Football" },
    { id: "3", title: "30-Day Fitness", participants: 892, sport: "Fitness" },
  ],
  Sports: sportChips,
  Reels: [
    { id: "1", title: "Perfect Bowling Action", views: "12.5K" },
    { id: "2", title: "Goal Scoring Tips", views: "8.2K" },
    { id: "3", title: "Morning Stretch Routine", views: "5.1K" },
  ],
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const handleChipClick = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((s) => s !== sportId)
        : [...prev, sportId]
    );
  };

  const renderResults = () => {
    switch (activeTab) {
      case "Users":
        return (
          <div className="space-y-3">
            {demoResults.Users.map((user) => (
              <button
                key={user.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/50 hover:bg-card transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user.avatar}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        );
      case "Challenges":
        return (
          <div className="space-y-3">
            {demoResults.Challenges.map((challenge) => (
              <button
                key={challenge.id}
                className="w-full p-4 rounded-xl bg-card/50 hover:bg-card transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {challenge.sport}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {challenge.participants} joined
                  </span>
                </div>
                <p className="font-semibold text-foreground">{challenge.title}</p>
              </button>
            ))}
          </div>
        );
      case "Sports":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {demoResults.Sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleChipClick(sport.id)}
                className={`p-4 rounded-xl transition-all ${
                  selectedSports.includes(sport.id)
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-card/50 hover:bg-card"
                }`}
              >
                <span className="text-3xl mb-2 block">{sport.emoji}</span>
                <p className="font-medium text-foreground">{sport.label}</p>
              </button>
            ))}
          </div>
        );
      case "Reels":
        return (
          <div className="space-y-3">
            {demoResults.Reels.map((reel) => (
              <button
                key={reel.id}
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-card/50 hover:bg-card transition-colors"
              >
                <p className="font-medium text-foreground">{reel.title}</p>
                <span className="text-sm text-muted-foreground">{reel.views} views</span>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-card/50 border border-border/30 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Interest Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {sportChips.map((sport) => (
            <button
              key={sport.id}
              onClick={() => handleChipClick(sport.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedSports.includes(sport.id)
                  ? "bg-primary text-white"
                  : "bg-card/50 text-foreground hover:bg-card"
              }`}
            >
              <span>{sport.emoji}</span>
              <span className="text-sm font-medium">{sport.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card/30 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-4">{renderResults()}</div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
