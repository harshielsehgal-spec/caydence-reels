import { useState, useRef, useEffect, useCallback } from "react";
import ReelCard from "./ReelCard";
import { Reel } from "@/lib/reels";

interface ReelsFeedProps {
  reels: Reel[];
  athleteId?: string;
  onAnalyze: (reel: Reel) => void;
  onOpenTips: (reel: Reel) => void;
  onOpenLeaderboard: (reel: Reel) => void;
}

const ReelsFeed = ({ reels, athleteId, onAnalyze, onOpenTips, onOpenLeaderboard }: ReelsFeedProps) => {
  const [visibleReelId, setVisibleReelId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
        const reelId = entry.target.getAttribute('data-reel-id');
        if (reelId) {
          setVisibleReelId(reelId);
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      threshold: 0.7,
    });

    reelRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [reels, handleIntersection]);

  const setReelRef = useCallback((reelId: string) => (el: HTMLDivElement | null) => {
    if (el) {
      reelRefs.current.set(reelId, el);
    } else {
      reelRefs.current.delete(reelId);
    }
  }, []);

  if (reels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No reels available</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {reels.map((reel) => (
        <div 
          key={reel.id} 
          ref={setReelRef(reel.id)}
          data-reel-id={reel.id}
        >
          <ReelCard
            reel={reel}
            athleteId={athleteId}
            onAnalyze={onAnalyze}
            onOpenTips={onOpenTips}
            onOpenLeaderboard={onOpenLeaderboard}
            isVisible={visibleReelId === reel.id}
          />
        </div>
      ))}
    </div>
  );
};

export default ReelsFeed;
