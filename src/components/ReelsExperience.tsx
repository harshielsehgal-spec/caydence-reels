import { useState, useEffect } from "react";
import ReelsFeed from "./reels/ReelsFeed";
import UploadAttemptModal from "./modals/UploadAttemptModal";
import ScoreRevealModal from "./modals/ScoreRevealModal";
import LeaderboardModal from "./modals/LeaderboardModal";
import AnalyzeTipsModal from "./modals/AnalyzeTipsModal";
import AttemptGateModal from "./modals/AttemptGateModal";
import AdModal from "./modals/AdModal";
import { Reel, fetchReels } from "@/lib/reels";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReelsExperienceProps {
  athleteId?: string;
}

const ReelsExperience = ({ athleteId }: ReelsExperienceProps) => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => { loadReels(); }, []);

  const loadReels = async () => {
    setIsLoading(true);
    const data = await fetchReels();
    setReels(data);
    setIsLoading(false);
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
    setLastScore(score);
    setLastCoins(coins);

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

    // Close upload, open cinematic reveal
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading reels...</p>
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
    </div>
  );
};

export default ReelsExperience;
