import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw, Flame, Dumbbell, Zap } from "lucide-react";
import { Reel } from "@/lib/reels";
import AthleteCard from "@/components/reels/AthleteCard";

interface ScoreBreakdown {
  armAlignment: number;
  hipPosition: number;
  timingSync: number;
}

interface ScoreRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  score: number;
  coins: number;
  sport?: string;
  onTryAgain: () => void;
}

const generateBreakdown = (totalScore: number): ScoreBreakdown => {
  const variance = () => Math.floor(Math.random() * 10) - 5;
  return {
    armAlignment: Math.min(100, Math.max(50, totalScore + variance())),
    hipPosition: Math.min(100, Math.max(50, totalScore + variance())),
    timingSync: Math.min(100, Math.max(50, totalScore + variance())),
  };
};

const getBadge = (score: number) => {
  if (score > 85) return { label: "Elite Match 🔥", icon: Flame, tier: "elite" as const };
  if (score >= 70) return { label: "Strong Attempt 💪", icon: Dumbbell, tier: "strong" as const };
  return { label: "Keep Training ⚡", icon: Zap, tier: "training" as const };
};

const ScoreRevealModal = ({ isOpen, onClose, reel, score, coins, sport = "gym", onTryAgain }: ScoreRevealModalProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhase] = useState<"counting" | "breakdown" | "complete" | "card">("counting");
  const [breakdown, setBreakdown] = useState<ScoreBreakdown>({ armAlignment: 0, hipPosition: 0, timingSync: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isOpen) {
      setDisplayScore(0);
      setPhase("counting");
      setShowConfetti(false);
      setShowCoins(false);
      return;
    }

    const bd = generateBreakdown(score);
    setBreakdown(bd);

    // Animate score counter
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("breakdown");
        if (score > 85) setShowConfetti(true);
        setTimeout(() => {
          setPhase("complete");
          setShowCoins(true);
          setTimeout(() => setPhase("card"), 1800);
        }, 800);
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isOpen, score]);

  const badge = getBadge(score);

  const badgeColorClass = {
    elite: "from-yellow-500 to-amber-600 text-background",
    strong: "gradient-primary text-primary-foreground",
    training: "from-muted to-secondary text-muted-foreground",
  }[badge.tier];

  const handleShare = async () => {
    const text = `I scored ${score}% on "${reel?.title}" on Caydence! 🔥`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Caydence Score", text }); } catch {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {}
    }
  };

  // Ring SVG
  const ringSize = 180;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground p-0 overflow-hidden rounded-2xl">
        {/* Confetti layer */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-fade-in"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: ['hsl(23,100%,50%)', 'hsl(45,100%,60%)', 'hsl(0,0%,100%)', 'hsl(18,100%,48%)'][i % 4],
                  animation: `confetti-fall ${1.5 + Math.random()}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {phase === "card" ? (
          /* ── Athlete Card Phase ── */
          <div className="relative p-6 flex flex-col items-center animate-fade-in">
            <AthleteCard
              score={score}
              armAlignment={breakdown.armAlignment}
              hipPosition={breakdown.hipPosition}
              timingSync={breakdown.timingSync}
              sport={sport}
              username="You"
              onShare={handleShare}
              onContinue={() => { onClose(); onTryAgain(); }}
            />
          </div>
        ) : (
          /* ── Score Reveal Phases ── */
          <div className="relative p-6 flex flex-col items-center">
            {/* Score Ring */}
            <div className="relative my-4" style={{ width: ringSize, height: ringSize }}>
              <svg className="absolute inset-0 -rotate-90" width={ringSize} height={ringSize}>
                <circle
                  cx={ringSize / 2} cy={ringSize / 2} r={radius}
                  fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth}
                />
                <circle
                  cx={ringSize / 2} cy={ringSize / 2} r={radius}
                  fill="none" stroke="url(#scoreGradient)" strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  className="transition-all duration-100"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(23, 100%, 50%)" />
                    <stop offset="100%" stopColor="hsl(18, 100%, 48%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black gradient-text">{displayScore}</span>
                <span className="text-sm text-muted-foreground font-semibold">%</span>
              </div>
            </div>

            {/* Badge */}
            <div className={`mt-2 px-5 py-2 rounded-full bg-gradient-to-r ${badgeColorClass} text-sm font-bold flex items-center gap-2 animate-scale-in`}>
              <badge.icon className="w-4 h-4" />
              {badge.label}
            </div>

            {/* Score Breakdown */}
            {phase !== "counting" && (
              <div className="w-full mt-6 space-y-3 animate-fade-in">
                {[
                  { label: "Arm Alignment", value: breakdown.armAlignment },
                  { label: "Hip Position", value: breakdown.hipPosition },
                  { label: "Timing Sync", value: breakdown.timingSync },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-semibold">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary transition-all duration-700"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VS Creator Card */}
            {phase !== "counting" && reel && (
              <div className="w-full mt-5 p-4 rounded-xl bg-secondary/50 border border-border animate-fade-in">
                <p className="text-xs text-muted-foreground text-center mb-3 font-semibold uppercase tracking-wider">VS Creator</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-16 h-20 relative">
                      <svg viewBox="0 0 40 56" className="w-full h-full">
                        <circle cx="20" cy="8" r="5" fill="none" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                        <line x1="20" y1="13" x2="20" y2="32" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                        <line x1="20" y1="18" x2="10" y2="28" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                        <line x1="20" y1="18" x2="30" y2="26" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                        <line x1="20" y1="32" x2="12" y2="48" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                        <line x1="20" y1="32" x2="28" y2="48" stroke="hsl(23,100%,50%)" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-primary">{reel.creator_username}</span>
                  </div>
                  <div className="text-2xl font-black text-muted-foreground">VS</div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-16 h-20 relative">
                      <svg viewBox="0 0 40 56" className="w-full h-full">
                        <circle cx="20" cy="8" r="5" fill="none" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                        <line x1="20" y1="13" x2="20" y2="32" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                        <line x1="20" y1="18" x2="8" y2="30" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                        <line x1="20" y1="18" x2="32" y2="24" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                        <line x1="20" y1="32" x2="10" y2="48" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                        <line x1="20" y1="32" x2="30" y2="48" stroke="hsl(0,0%,100%)" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">You</span>
                  </div>
                </div>
              </div>
            )}

            {/* Coins Animation */}
            {showCoins && (
              <div className="mt-4 animate-fade-in">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25">
                  <span className="text-lg">🪙</span>
                  <span className="text-sm font-bold text-primary">+{coins} Caydence Coins</span>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreRevealModal;
