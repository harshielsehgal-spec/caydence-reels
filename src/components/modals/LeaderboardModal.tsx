import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Medal, User, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reel, fetchLeaderboard, LeaderboardEntry } from "@/lib/reels";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId?: string;
  isJoined?: boolean;
  onJoinChallenge?: (reelId: string) => void;
}

// Fallback demo leaderboard when no real data exists
const fallbackLeaderboard: LeaderboardEntry[] = [
  { athlete_id: "demo-1", best_score: 95, attempts_count: 7, rank: 1 },
  { athlete_id: "demo-2", best_score: 92, attempts_count: 5, rank: 2 },
  { athlete_id: "demo-3", best_score: 90, attempts_count: 8, rank: 3 },
  { athlete_id: "demo-4", best_score: 88, attempts_count: 4, rank: 4 },
];

const fallbackNames: { [key: string]: string } = {
  "demo-1": "Aarya Singh",
  "demo-2": "Kabir Mehra",
  "demo-3": "Rohan Verma",
  "demo-4": "Meera Nair",
};

const LeaderboardModal = ({ isOpen, onClose, reel, athleteId, isJoined = false, onJoinChallenge }: LeaderboardModalProps) => {
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
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
      default:
        return "bg-slate-800/50 border-slate-700/50";
    }
  };

  const handleJoinChallenge = () => {
    if (reel && onJoinChallenge) {
      onJoinChallenge(reel.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF7A00]" />
            Leaderboard
          </DialogTitle>
          {reel && (
            <p className="text-sm text-gray-400 mt-1">{reel.title}</p>
          )}
        </DialogHeader>

        {/* Join Challenge Section */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-300 mb-3">
            Join this challenge to track your attempts and see where you rank.
          </p>
          <Button
            onClick={handleJoinChallenge}
            disabled={isJoined}
            className={`w-full h-10 ${
              isJoined 
                ? 'bg-slate-700 text-gray-400 cursor-default' 
                : 'bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] text-white hover:opacity-90'
            }`}
          >
            {isJoined ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Joined
              </>
            ) : (
              'Join Challenge'
            )}
          </Button>
        </div>

        {/* User's Score Card */}
        {userEntry && (
          <div className="bg-gradient-to-r from-[#FF7A00]/20 to-[#FF5C00]/10 border border-[#FF7A00]/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Your Best</p>
                  <p className="text-xs text-gray-400">{userEntry.attempts_count} attempts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#FF7A00]">{userEntry.best_score}%</p>
                <p className="text-xs text-gray-400">Rank #{userEntry.rank}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No attempts yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to try this move!</p>
            </div>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.athlete_id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${getRankBg(Number(entry.rank))} ${
                  athleteId === entry.athlete_id ? 'ring-2 ring-[#FF7A00]/50' : ''
                }`}
              >
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(Number(entry.rank))}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
                    {athleteId === entry.athlete_id 
                      ? 'You' 
                      : fallbackNames[entry.athlete_id] || `Athlete ${entry.athlete_id.slice(0, 8)}`
                    }
                  </p>
                  <p className="text-xs text-gray-400">{entry.attempts_count} attempts</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-white">{entry.best_score}%</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;