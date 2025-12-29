import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Medal, User, TrendingUp, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reel, fetchLeaderboard, LeaderboardEntry } from "@/lib/reels";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId?: string;
  isJoined?: boolean;
  onJoinChallenge?: (reelId: string) => void;
  userBestScore?: number;
}

const DEMO_PLAYERS_JOINED = 124;

// Fallback demo leaderboard when no real data exists
const fallbackLeaderboard: LeaderboardEntry[] = [
  { athlete_id: "demo-1", best_score: 95, attempts_count: 7, rank: 1 },
  { athlete_id: "demo-2", best_score: 92, attempts_count: 5, rank: 2 },
  { athlete_id: "demo-3", best_score: 90, attempts_count: 8, rank: 3 },
  { athlete_id: "demo-4", best_score: 88, attempts_count: 4, rank: 4 },
  { athlete_id: "demo-5", best_score: 85, attempts_count: 6, rank: 5 },
];

const fallbackNames: { [key: string]: string } = {
  "demo-1": "Aarya Singh",
  "demo-2": "Kabir Mehra",
  "demo-3": "Rohan Verma",
  "demo-4": "Meera Nair",
  "demo-5": "Priya Sharma",
};

const LeaderboardModal = ({ isOpen, onClose, reel, athleteId, isJoined = false, onJoinChallenge, userBestScore }: LeaderboardModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    if (isOpen && reel) {
      loadLeaderboard();
    }
  }, [isOpen, reel]);

  const loadLeaderboard = async () => {
    if (!reel) return;
    setIsLoading(true);
    const data = await fetchLeaderboard(reel.id);
    
    // Use fallback data if empty or error
    if (data.length === 0) {
      setLeaderboard(fallbackLeaderboard);
    } else {
      setLeaderboard(data);
    }
    
    if (athleteId) {
      const entry = data.find(e => e.athlete_id === athleteId);
      setUserEntry(entry || null);
    }
    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/15 to-yellow-600/5 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/15 to-gray-500/5 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/15 to-amber-700/5 border-amber-600/30";
      default:
        return "bg-secondary/50 border-border";
    }
  };

  const handleJoinChallenge = () => {
    if (reel && onJoinChallenge) {
      onJoinChallenge(reel.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
        {/* Large Trophy Header */}
        <div className="flex flex-col items-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-orange mb-3">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground text-center">
            Join Challenge
          </DialogTitle>
          {reel && (
            <p className="text-sm text-muted-foreground mt-1 text-center">{reel.title}</p>
          )}
        </div>

        {/* Players Joined Count */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 mx-4 rounded-lg bg-secondary/50 border border-border mb-3">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Players Joined: <span className="text-primary font-bold">{DEMO_PLAYERS_JOINED}</span></span>
        </div>

        {/* Reward Coins Banner */}
        <div className="flex items-center justify-center gap-2 py-3 px-4 mx-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
          <Coins className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Earn 50 Caydence Coins</span>
        </div>

        {/* User's Best Score Card */}
        {userBestScore && userBestScore > 0 && (
          <div className="mx-4 mb-4 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Your Best</p>
                  <p className="text-xs text-muted-foreground">Personal record</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">{userBestScore}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Join Button */}
        <div className="px-4 mb-4">
          <Button
            onClick={handleJoinChallenge}
            disabled={isJoined}
            className={`w-full h-12 text-base font-semibold rounded-xl ${
              isJoined 
                ? 'bg-secondary text-muted-foreground cursor-default' 
                : 'gradient-primary text-primary-foreground hover:opacity-90 glow-orange'
            }`}
          >
            {isJoined ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Joined
              </>
            ) : (
              'Join Challenge'
            )}
          </Button>
        </div>

        {/* Leaderboard Preview - Top 5 */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Leaderboard
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-muted mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No attempts yet</p>
                <p className="text-xs text-muted-foreground mt-1">Be the first to try!</p>
              </div>
            ) : (
              leaderboard.slice(0, 5).map((entry) => (
                <div
                  key={entry.athlete_id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${getRankBg(Number(entry.rank))} ${
                    athleteId === entry.athlete_id ? 'ring-1 ring-primary/50' : ''
                  }`}
                >
                  <div className="w-7 flex items-center justify-center">
                    {getRankIcon(Number(entry.rank))}
                  </div>
                  
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {athleteId === entry.athlete_id 
                        ? 'You' 
                        : fallbackNames[entry.athlete_id] || `Athlete ${entry.athlete_id.slice(0, 6)}`
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.attempts_count} attempts</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{entry.best_score}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
