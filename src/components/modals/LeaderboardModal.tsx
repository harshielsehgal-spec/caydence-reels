import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Medal, User, TrendingUp, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reel } from "@/lib/reels";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  athlete_id: string;
  best_score: number;
  attempts_count: number;
  rank: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId?: string;
  isJoined?: boolean;
  onJoinChallenge?: (reelId: string) => void;
  userBestScore?: number;
}

const podiumGradients: Record<number, string> = {
  1: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/40",
  2: "from-gray-300/15 to-gray-400/5 border-gray-300/30",
  3: "from-amber-600/15 to-amber-700/5 border-amber-600/30",
};

const LeaderboardModal = ({ isOpen, onClose, reel, athleteId, isJoined = false, onJoinChallenge, userBestScore }: LeaderboardModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const currentAthleteId = athleteId || localStorage.getItem("caydence_athlete_id") || "";

  useEffect(() => {
    if (isOpen && reel) loadLeaderboard();
  }, [isOpen, reel]);

  const loadLeaderboard = async () => {
    if (!reel) return;
    setIsLoading(true);
    setFetchError(null);

    // Query reel_attempts grouped by athlete_id
    const { data, error } = await supabase
      .from("reel_attempts")
      .select("athlete_id, ai_match_score")
      .eq("reel_id", reel.id);

    if (error) {
      console.error("Failed to load leaderboard:", error);
      setFetchError("Failed to load leaderboard");
      setLeaderboard([]);
      setTotalPlayers(0);
      setIsLoading(false);
      return;
    }
    if (!data) {
      setLeaderboard([]);
      setTotalPlayers(0);
      setIsLoading(false);
      return;
    }

    // Group by athlete_id, compute best score and attempt count
    const grouped: Record<string, { scores: number[] }> = {};
    for (const row of data) {
      if (!grouped[row.athlete_id]) grouped[row.athlete_id] = { scores: [] };
      grouped[row.athlete_id].scores.push(row.ai_match_score);
    }

    const entries = Object.entries(grouped)
      .map(([aid, { scores }]) => ({
        athlete_id: aid,
        best_score: Math.max(...scores),
        attempts_count: scores.length,
        rank: 0,
      }))
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, 10)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    setLeaderboard(entries);
    setTotalPlayers(Object.keys(grouped).length);
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

  // Find current user's rank
  const userEntry = leaderboard.find(e => e.athlete_id === currentAthleteId);

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
              <span className="text-primary font-bold">{totalPlayers || "—"}</span> joined
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">50 Coins</span>
          </div>
        </div>

        {/* Your Rank Card */}
        {(userEntry || (userBestScore && userBestScore > 0)) && (
          <div className="mx-6 my-3 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Your Best</p>
                  <p className="text-xs text-muted-foreground">
                    {userEntry ? `Rank #${userEntry.rank} · ${userEntry.attempts_count} attempts` : "Beat your best to climb"}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-black text-primary">
                {userEntry ? userEntry.best_score : userBestScore}%
              </p>
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
              /* Loading skeletons */
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))
            ) : fetchError ? (
              <div className="flex flex-col items-center py-10">
                <p className="text-foreground font-semibold text-sm mb-2">{fetchError}</p>
                <button
                  onClick={loadLeaderboard}
                  className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  Retry
                </button>
              </div>
            ) : leaderboard.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center py-10">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Trophy className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold text-sm">No attempts yet</p>
                <p className="text-muted-foreground text-xs mt-1 text-center">
                  Be the first to attempt this challenge!
                </p>
              </div>
            ) : (
              leaderboard.map((entry) => {
                const rank = entry.rank;
                const isPodium = rank <= 3;
                const isCurrentUser = entry.athlete_id === currentAthleteId;
                const gradientClass = isPodium
                  ? podiumGradients[rank]
                  : "bg-secondary/50 border-border";

                return (
                  <div
                    key={entry.athlete_id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${gradientClass} ${
                      rank === 1 ? "animate-pulse" : ""
                    } ${isCurrentUser ? "ring-2 ring-primary/60" : ""}`}
                    style={rank === 1 ? { boxShadow: "0 0 20px hsl(23,100%,50%,0.15)" } : undefined}
                  >
                    <div className="w-7 flex items-center justify-center">{getRankIcon(rank)}</div>
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {isCurrentUser ? "You" : entry.athlete_id.slice(0, 8)}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded">You</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.attempts_count} attempts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{entry.best_score}%</div>
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
