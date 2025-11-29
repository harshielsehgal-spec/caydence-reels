import { useState, useEffect } from "react";
import ReelsFeed from "./reels/ReelsFeed";
import UploadAttemptModal from "./modals/UploadAttemptModal";
import LeaderboardModal from "./modals/LeaderboardModal";
import AnalyzeTipsModal from "./modals/AnalyzeTipsModal";
import { Reel, fetchReels } from "@/lib/reels";
import { Loader2 } from "lucide-react";

interface ReelsExperienceProps {
  athleteId?: string;
}

const ReelsExperience = ({ athleteId }: ReelsExperienceProps) => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [userScores, setUserScores] = useState<Record<string, number>>({});
  const [joinedChallenges, setJoinedChallenges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    setIsLoading(true);
    const data = await fetchReels();
    setReels(data);
    setIsLoading(false);
  };

  const handleAnalyze = (reel: Reel) => {
    setSelectedReel(reel);
    setIsUploadModalOpen(true);
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
    setUserScores(prev => ({ ...prev, [reelId]: score }));
  };

  const handleJoinChallenge = (reelId: string) => {
    setJoinedChallenges(prev => ({ ...prev, [reelId]: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#FF7A00] animate-spin" />
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
      />

      <UploadAttemptModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        reel={selectedReel}
        athleteId={athleteId || ''}
        onResult={handleScoreResult}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        reel={selectedReel}
        athleteId={athleteId}
        isJoined={selectedReel ? joinedChallenges[selectedReel.id] || false : false}
        onJoinChallenge={handleJoinChallenge}
      />

      <AnalyzeTipsModal
        isOpen={isTipsModalOpen}
        onClose={() => setIsTipsModalOpen(false)}
        reel={selectedReel}
        athleteId={athleteId}
      />
    </div>
  );
};

export default ReelsExperience;