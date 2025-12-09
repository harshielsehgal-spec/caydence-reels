import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reel, fetchReels } from "@/lib/reels";
import { Loader2 } from "lucide-react";
import HomeTabs, { TabType } from "./HomeTabs";
import QuestStrip from "./QuestStrip";
import DailyChallengeTile from "./DailyChallengeTile";
import CoinsHeader from "./CoinsHeader";
import ReelTile from "./ReelTile";

// Demo data for challenge tags
const challengeReelIds = new Set<string>();

const CaydenceReelsHome = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("for-you");
  const [coins, setCoins] = useState(125);
  const [pendingCoinAnimation, setPendingCoinAnimation] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    setIsLoading(true);
    const data = await fetchReels();
    setReels(data);
    // Mark first reel as a challenge reel
    if (data.length > 0) {
      challengeReelIds.add(data[0].id);
    }
    setIsLoading(false);
  };

  const handleReelClick = (reel: Reel) => {
    console.log("Reel tapped:", reel.id);
    navigate("/");
  };

  const handleCoinsEarned = (amount: number) => {
    setPendingCoinAnimation(amount);
    setCoins((prev) => prev + amount);
  };

  const handleAnimationComplete = () => {
    setPendingCoinAnimation(null);
  };

  // Filter reels based on active tab
  const getFilteredReels = (): Reel[] => {
    switch (activeTab) {
      case "trending":
        return [...reels].sort((a, b) => b.likes_count - a.likes_count);
      case "challenges":
        return reels.filter((r) => challengeReelIds.has(r.id));
      case "for-you":
      default:
        return reels;
    }
  };

  const filteredReels = getFilteredReels();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[420px] mx-auto">
      {/* Instagram-style Top Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
        {/* Logo + Coins Row */}
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold font-display">
            <span className="text-primary">Caydence</span>
          </h1>
          <CoinsHeader
            coins={coins}
            pendingAnimation={pendingCoinAnimation}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>

        {/* Minimal Tabs with underline indicator */}
        <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* Quest Strip */}
      <QuestStrip onCoinsEarned={handleCoinsEarned} />

      {/* Grid Container */}
      <div className="px-1 pb-4">
        {filteredReels.length === 0 && activeTab !== "for-you" ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <p className="text-muted-foreground">No reels in this category yet</p>
            <button
              onClick={() => setActiveTab("for-you")}
              className="text-primary text-sm font-medium hover:underline"
            >
              Browse all reels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {/* Daily Challenge Tile - only show on For You tab */}
            {activeTab === "for-you" && (
              <DailyChallengeTile
                onCoinsEarned={handleCoinsEarned}
                onNavigateToChallenge={() => navigate("/")}
              />
            )}

            {/* Reel Tiles with staggered heights */}
            {filteredReels.map((reel, index) => {
              const isLarge = activeTab === "for-you" ? (index + 2) % 5 === 0 : index % 5 === 0;
              return (
                <ReelTile
                  key={reel.id}
                  reel={reel}
                  isLarge={isLarge}
                  onClick={handleReelClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaydenceReelsHome;
