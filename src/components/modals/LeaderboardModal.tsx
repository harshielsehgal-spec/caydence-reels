import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

const fallbackLeaderboard: LeaderboardEntry[] = [
  { athlete_id: "demo-1", best_score: 95, attempts_count: 7, rank: 1 },
  { athlete_id: "demo-2", best_score: 92, attempts_count: 5, rank: 2 },
  { athlete_id: "demo-3", best_score: 90, attempts_count: 8, rank: 3 },
  { athlete_id: "demo-4", best_score: 88, attempts_count: 4, rank: 4 },
  { athlete_id: "demo-5", best_score: 85, attempts_count: 6, rank: 5 },
];

const fallbackNames: Record<string, string> = {
  "demo-1": "Aarya Singh",
  "demo-2": "Kabir Mehra",
  "demo-3": "Rohan Verma",
  "demo-4": "Meera Nair",
  "demo-5": "Priya Sharma",
};

const podiumGradients: Record<number, string> = {
  1: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/40",
  2: "from-gray-300/15 to-gray-400/5 border-gray-300/30",
  3: "from-amber-600/15 to-amber-700/5 border-amber-600/30",
};

const LeaderboardModal = ({ isOpen, onClose, reel, athleteId, isJoined = false, onJoinChallenge, userBestScore }: LeaderboardModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && reel) loadLeaderboard();
  }, [isOpen, reel]);

  const loadLeaderboard = async () => {
    if (!reel) return;
    setIsLoading(true);
    const data = await fetchLeaderboard(reel.id);
    setLeaderboard(data.length === 0 ? fallbackLeaderboard : data);
    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const handleJoin = () => {
    if (reel && onJoinChallenge) onJoinChallenge(reel.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground max-h-[85vh] overflow-hidden flex flex-col rounded-2xl p-0">
        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-orange mb-3">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground text-center">
            Challenge Leaderboard
          </DialogTitle>
          {reel && <p className="text-sm text-muted-foreground mt-1 text-center">{reel.title}</p>}
        </div>

        {/* Players count + coins */}
        <div className="flex items-center gap-2 px-6 mb-2">
          <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary/50 border border-border">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-primary font-bold">{DEMO_PLAYERS_JOINED}</span> joined
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">50 Coins</span>
          </div>
        </div>

        {/* Your Rank Card */}
        {userBestScore && userBestScore > 0 && (
          <div className="mx-6 my-3 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Your Best</p>
                  <p className="text-xs text-muted-foreground">Rank #47 · Beat your best to climb</p>
                </div>
              </div>
              <p className="text-2xl font-black text-primary">{userBestScore}%</p>
            </div>
          </div>
        )}

        {/* Join button */}
        <div className="px-6 mb-3">
          <Button
            onClick={handleJoin}
            disabled={isJoined}
            className={`w-full h-12 text-base font-semibold rounded-xl ${
              isJoined
                ? "bg-secondary text-muted-foreground cursor-default"
                : "gradient-primary text-primary-foreground hover:opacity-90 glow-orange"
            }`}
          >
            {isJoined ? <><Check className="w-5 h-5 mr-2" />Joined</> : "Join Challenge"}
          </Button>
        </div>

        {/* Leaderboard List */}
        <div className="px-6 pb-6 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Top Performers
          </h3>
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              leaderboard.slice(0, 5).map((entry) => {
                const rank = Number(entry.rank);
                const isPodium = rank <= 3;
                const gradientClass = isPodium
                  ? podiumGradients[rank]
                  : "bg-secondary/50 border-border";

                return (
                  <div
                    key={entry.athlete_id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${gradientClass} ${
                      rank === 1 ? "animate-pulse" : ""
                    } ${athleteId === entry.athlete_id ? "ring-1 ring-primary/50" : ""}`}
                    style={rank === 1 ? { boxShadow: "0 0 20px hsl(23,100%,50%,0.15)" } : undefined}
                  >
                    <div className="w-7 flex items-center justify-center">{getRankIcon(rank)}</div>
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {athleteId === entry.athlete_id
                          ? "You"
                          : fallbackNames[entry.athlete_id] || `Athlete ${entry.athlete_id.slice(0, 6)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.attempts_count} attempts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{entry.best_score}%</div>
                      {/* Mini bar */}
                      <div className="w-16 h-1.5 rounded-full bg-secondary mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary transition-all duration-500"
                          style={{ width: `${entry.best_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
