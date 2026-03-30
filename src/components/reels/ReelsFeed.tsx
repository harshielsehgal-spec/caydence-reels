import { useState, useRef, useEffect, useCallback } from "react";
import ReelCard from "./ReelCard";
import SportsCategoryFilter from "./SportsCategoryFilter";
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
}

const ReelsFeed = ({ reels, athleteId, onAnalyze, onOpenTips, onOpenLeaderboard, userScores = {}, joinedChallenges = {}, attemptHistories = {}, onOpenCollection }: ReelsFeedProps) => {
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
      {/* Sports filter pinned at top */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-background via-background/80 to-transparent">
        <SportsCategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
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
