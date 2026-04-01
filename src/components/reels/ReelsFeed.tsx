import { useState, useRef, useEffect, useCallback } from "react";
import ReelCard from "./ReelCard";
import SportsCategoryFilter from "./SportsCategoryFilter";
import { Bell } from "lucide-react";
import { Reel } from "@/lib/reels";

interface ReelsFeedProps {
  reels: Reel[];
  athleteId?: string;
  onAnalyze: (reel: Reel) => void;
  onOpenTips: (reel: Reel) => void;
  onOpenLeaderboard: (reel: Reel) => void;
  userScores?: Record<string, number>;
  joinedChallenges?: Record<string, boolean>;
  attemptHistories?: Record<string, { score: number }[]>;
  onOpenCollection?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifCount?: number;
}

const ReelsFeed = ({ reels, athleteId, onAnalyze, onOpenTips, onOpenLeaderboard, userScores = {}, joinedChallenges = {}, attemptHistories = {}, onOpenCollection, onOpenNotifications, unreadNotifCount = 0 }: ReelsFeedProps) => {
  const [visibleReelId, setVisibleReelId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
        const reelId = entry.target.getAttribute('data-reel-id');
        if (reelId) setVisibleReelId(reelId);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      threshold: 0.7,
    });
    reelRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reels, handleIntersection]);

  const setReelRef = useCallback((reelId: string) => (el: HTMLDivElement | null) => {
    if (el) reelRefs.current.set(reelId, el);
    else reelRefs.current.delete(reelId);
  }, []);

  if (reels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No reels available</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-background">
      {/* Sports filter + collection icon pinned at top */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center">
          <div className="flex-1 overflow-hidden">
            <SportsCategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative flex-shrink-0 w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-primary/20 transition-all"
            >
              <Bell className="w-5 h-5 text-primary" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </button>
          )}
          {onOpenCollection && (
            <button
              onClick={onOpenCollection}
              className="flex-shrink-0 mr-3 w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-primary/20 transition-all"
            >
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <rect x="5" y="2" width="14" height="16" rx="2" />
                <rect x="8" y="0" width="8" height="16" rx="1" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {reels.map((reel) => (
          <div
            key={reel.id}
            ref={setReelRef(reel.id)}
            data-reel-id={reel.id}
            className="h-screen w-full snap-start snap-always"
          >
            <ReelCard
              reel={reel}
              athleteId={athleteId}
              onAnalyze={onAnalyze}
              onOpenTips={onOpenTips}
              onOpenLeaderboard={onOpenLeaderboard}
              isVisible={visibleReelId === reel.id}
              userScore={userScores[reel.id]}
              isJoined={joinedChallenges[reel.id]}
              attemptHistory={attemptHistories[reel.id] || []}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsFeed;
