import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Zap, Coins, Film, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";

interface AttemptRow {
  id: string;
  reel_id: string;
  ai_match_score: number;
  coins_earned: number;
  created_at: string;
  reel_title?: string;
  reel_sport?: string;
}

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const sportEmoji: Record<string, string> = {
  cricket: "🏏",
  football: "⚽",
  gym: "💪",
  gym_pushup: "💪",
  badminton: "🏸",
  basketball: "🏀",
  yoga: "🧘",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const athleteId = localStorage.getItem("caydence_athlete_id") || "";
  const initials = athleteId.slice(0, 2).toUpperCase();

  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Fetch attempts
    const { data: attemptsData } = await supabase
      .from("reel_attempts")
      .select("id, reel_id, ai_match_score, coins_earned, created_at")
      .eq("athlete_id", athleteId)
      .order("created_at", { ascending: false });

    if (!attemptsData || attemptsData.length === 0) {
      setAttempts([]);
      setLoading(false);
      return;
    }

    // Fetch reel titles for the attempts
    const reelIds = [...new Set(attemptsData.map(a => a.reel_id))];
    const { data: reelsData } = await supabase
      .from("reels")
      .select("id, title, sport")
      .in("id", reelIds);

    const reelMap: Record<string, { title: string; sport: string }> = {};
    reelsData?.forEach(r => {
      reelMap[r.id] = { title: r.title, sport: r.sport };
    });

    const enriched: AttemptRow[] = attemptsData.map(a => ({
      ...a,
      reel_title: reelMap[a.reel_id]?.title || "Unknown Reel",
      reel_sport: reelMap[a.reel_id]?.sport || "general",
    }));

    setAttempts(enriched);
    setLoading(false);
  };

  const totalAttempts = attempts.length;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.ai_match_score)) : 0;
  const totalCoins = attempts.reduce((sum, a) => sum + a.coins_earned, 0);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative pt-6 pb-8 px-6">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-orange mb-3">
            <span className="text-2xl font-black text-primary-foreground">{initials}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-['Space_Grotesk']">Athlete</h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{athleteId.slice(0, 8)}…</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <Film className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{totalAttempts}</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Attempts</span>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <Trophy className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{bestScore}%</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Best Score</span>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <Coins className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">{totalCoins}</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Coins</span>
            </div>
          </>
        )}
      </div>

      {/* Attempt History */}
      <div className="px-4">
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 font-['Space_Grotesk']">
          <Zap className="w-4 h-4 text-primary" />
          Attempt History
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : attempts.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold text-base mb-1">No attempts yet</p>
            <p className="text-muted-foreground text-sm text-center">
              Head to the Reels feed and try matching a move!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border"
              >
                {/* Sport icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                  {sportEmoji[attempt.reel_sport || ""] || "🎯"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{attempt.reel_title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {attempt.reel_sport}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatTimeAgo(attempt.created_at)}</span>
                  </div>
                </div>

                {/* Score + coins */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-foreground">{attempt.ai_match_score}%</p>
                  <p className="text-[10px] text-primary font-semibold">+{attempt.coins_earned} 🪙</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
