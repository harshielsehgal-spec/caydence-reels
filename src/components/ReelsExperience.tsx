import { useState, useEffect } from "react";
import ReelsFeed from "./reels/ReelsFeed";
import UploadAttemptModal from "./modals/UploadAttemptModal";
import ScoreRevealModal from "./modals/ScoreRevealModal";
import LeaderboardModal from "./modals/LeaderboardModal";
import AnalyzeTipsModal from "./modals/AnalyzeTipsModal";
import AttemptGateModal from "./modals/AttemptGateModal";
import AdModal from "./modals/AdModal";
import CardCollectionModal, { CollectedCard } from "./modals/CardCollectionModal";
import NotificationsModal from "./modals/NotificationsModal";
import { Reel, fetchReels } from "@/lib/reels";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReelsExperienceProps {
  athleteId?: string;
  preferredSports?: string[];
}

const getTierFromScore = (score: number): string => {
  if (score >= 95) return "legend";
  if (score >= 85) return "elite";
  if (score >= 75) return "athlete";
  if (score >= 60) return "contender";
  return "rookie";
};

const ReelsExperience = ({ athleteId, preferredSports = [] }: ReelsExperienceProps) => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScoreRevealOpen, setIsScoreRevealOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [userScores, setUserScores] = useState<Record<string, number>>({});
  const [userBestScores, setUserBestScores] = useState<Record<string, number>>({});
  const [joinedChallenges, setJoinedChallenges] = useState<Record<string, boolean>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [attemptHistories, setAttemptHistories] = useState<Record<string, { score: number }[]>>({});
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [gatedReelId, setGatedReelId] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastCoins, setLastCoins] = useState(0);
  const [lastSport, setLastSport] = useState("general");
  const [lastBreakdown, setLastBreakdown] = useState({ arm: 0, hip: 0, sync: 0 });
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  // Card collection state
  const [cardCollection, setCardCollection] = useState<Record<string, CollectedCard>>({});
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const resolvedAthleteId = athleteId || localStorage.getItem("caydence_athlete_id") || "";

  // Fetch unread notification count
  useEffect(() => {
    if (!resolvedAthleteId) return;
    const fetchUnread = async () => {
      const { count, error } = await (await import("@/integrations/supabase/client")).supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("athlete_id", resolvedAthleteId)
        .eq("read", false);
      if (!error && count !== null) setUnreadNotifCount(count);
    };
    fetchUnread();
  }, [resolvedAthleteId, isNotificationsOpen]);

  useEffect(() => { loadReels(); }, []);

  const loadReels = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchReels();
      // Sort preferred sports first
      if (preferredSports.length > 0) {
        const prefSet = new Set(preferredSports);
        data.sort((a, b) => {
          const aMatch = prefSet.has(a.sport) || prefSet.has(a.sport.replace(/_.*/, "")) ? 0 : 1;
          const bMatch = prefSet.has(b.sport) || prefSet.has(b.sport.replace(/_.*/, "")) ? 0 : 1;
          return aMatch - bMatch;
        });
      }
      setReels(data);
    } catch (err) {
      console.error("Failed to load reels:", err);
      setFetchError("Failed to load reels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = (reel: Reel) => {
    const attempts = attemptCounts[reel.id] ?? 0;
    if (attempts >= 3) {
      setGatedReelId(reel.id);
      setSelectedReel(reel);
      setIsGateModalOpen(true);
    } else {
      setSelectedReel(reel);
      setIsUploadModalOpen(true);
    }
  };

  const handleOpenTips = (reel: Reel) => {
    setSelectedReel(reel);
    setIsTipsModalOpen(true);
  };

  const handleOpenLeaderboard = (reel: Reel) => {
    setSelectedReel(reel);
    setIsLeaderboardOpen(true);
  };

  const handleScoreResult = (reelId: string, score: number) => {
    const coins = Math.floor(score / 10) + 10;
    const sport = selectedReel?.sport || "general";

    // Generate breakdown
    const variance = () => Math.floor(Math.random() * 10) - 5;
    const breakdown = {
      arm: Math.min(100, Math.max(50, score + variance())),
      hip: Math.min(100, Math.max(50, score + variance())),
      sync: Math.min(100, Math.max(50, score + variance())),
    };

    setLastScore(score);
    setLastCoins(coins);
    setLastSport(sport);
    setLastBreakdown(breakdown);
    setLastFeedback(null); // Reset feedback — skeleton shows until Claude responds

    setUserScores(prev => ({ ...prev, [reelId]: score }));
    setAttemptCounts(prev => ({ ...prev, [reelId]: (prev[reelId] ?? 0) + 1 }));
    setUserBestScores(prev => {
      const currentBest = prev[reelId] ?? 0;
      return score > currentBest ? { ...prev, [reelId]: score } : prev;
    });
    setAttemptHistories(prev => ({
      ...prev,
      [reelId]: [...(prev[reelId] || []), { score }],
    }));

    // Update card collection — only if new score is higher for this sport
    setCardCollection(prev => {
      const existing = prev[sport];
      if (!existing || score > existing.score) {
        return {
          ...prev,
          [sport]: {
            score,
            tier: getTierFromScore(score),
            breakdown,
            sport,
            earnedAt: new Date().toISOString(),
          },
        };
      }
      return prev;
    });

    // Fire Claude feedback async — never blocks score reveal
    fetch('https://caydence-reels-backend.onrender.com/reels/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sport: sport,
        creator_name: selectedReel?.creator_username || 'the creator',
        arm_score: breakdown.arm,
        hip_score: breakdown.hip,
        timing_score: breakdown.sync,
        overall_score: score,
      }),
    })
      .then(r => r.json())
      .then(data => {
        console.log('Received feedback:', data.feedback);
        if (data.feedback) setLastFeedback(data.feedback);
      })
      .catch(err => {
        console.warn('Feedback fetch failed:', err);
        setLastFeedback(null);
      });

    setIsUploadModalOpen(false);
    setTimeout(() => setIsScoreRevealOpen(true), 300);
  };

  const handleTryAgainFromReveal = () => {
    setIsScoreRevealOpen(false);
    if (selectedReel) {
      setTimeout(() => handleAnalyze(selectedReel), 300);
    }
  };

  const handleWatchAd = () => {
    setIsGateModalOpen(false);
    setIsAdModalOpen(true);
  };

  const handlePayDemo = () => {
    if (gatedReelId) {
      setAttemptCounts(prev => ({ ...prev, [gatedReelId]: 2 }));
      toast({ title: "Demo payment successful. Extra attempt unlocked." });
      setIsGateModalOpen(false);
      setIsUploadModalOpen(true);
    }
  };

  const handleAdComplete = () => {
    if (gatedReelId) {
      setAttemptCounts(prev => ({ ...prev, [gatedReelId]: 2 }));
      setIsAdModalOpen(false);
      setIsUploadModalOpen(true);
    }
  };

  const handleJoinChallenge = (reelId: string) => {
    setJoinedChallenges(prev => ({ ...prev, [reelId]: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-0 lg:pl-[220px] xl:pl-[240px]">
        {[1, 2].map((i) => (
          <div key={i} className="h-screen w-full flex flex-col p-4 gap-4 lg:max-w-[480px] lg:mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-28 bg-secondary rounded animate-pulse" />
                <div className="h-2.5 w-20 bg-secondary rounded animate-pulse" />
              </div>
            </div>
            <div className="flex-1 bg-secondary rounded-xl animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-secondary rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-secondary rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-secondary rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center lg:pl-[220px] xl:pl-[240px]">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-foreground font-semibold">{fetchError}</p>
          <p className="text-sm text-muted-foreground">Check your connection and try again</p>
          <button
            onClick={loadReels}
            className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReelsFeed
        reels={reels}
        athleteId={athleteId}
        onAnalyze={handleAnalyze}
        onOpenTips={handleOpenTips}
        onOpenLeaderboard={handleOpenLeaderboard}
        userScores={userScores}
        joinedChallenges={joinedChallenges}
        attemptHistories={attemptHistories}
        onOpenCollection={() => setIsCollectionOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotifCount={unreadNotifCount}
      />

      <UploadAttemptModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        reel={selectedReel}
        athleteId={athleteId || ''}
        onResult={handleScoreResult}
      />

      <ScoreRevealModal
        isOpen={isScoreRevealOpen}
        onClose={() => setIsScoreRevealOpen(false)}
        reel={selectedReel}
        score={lastScore}
        coins={lastCoins}
        sport={lastSport}
        coachingFeedback={lastFeedback || undefined}
        onTryAgain={handleTryAgainFromReveal}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        reel={selectedReel}
        athleteId={athleteId}
        isJoined={selectedReel ? joinedChallenges[selectedReel.id] || false : false}
        onJoinChallenge={handleJoinChallenge}
        userBestScore={selectedReel ? userBestScores[selectedReel.id] : undefined}
      />

      <AnalyzeTipsModal
        isOpen={isTipsModalOpen}
        onClose={() => setIsTipsModalOpen(false)}
        reel={selectedReel}
        athleteId={athleteId}
      />

      <AttemptGateModal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        onWatchAd={handleWatchAd}
        onPay={handlePayDemo}
      />

      <AdModal isOpen={isAdModalOpen} onComplete={handleAdComplete} />

      <CardCollectionModal
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
        collection={cardCollection}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        athleteId={resolvedAthleteId}
        onUnreadCountChange={setUnreadNotifCount}
      />
    </div>
  );
};

export default ReelsExperience;