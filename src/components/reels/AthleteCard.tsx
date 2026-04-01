import { useState, useEffect } from "react";
import { Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AthleteCardProps {
  score: number;
  armAlignment: number;
  hipPosition: number;
  timingSync: number;
  sport?: string;
  username?: string;
  onShare: () => void;
  onContinue: () => void;
}

type CardTier = "rookie" | "contender" | "athlete" | "elite" | "legend";

const getTier = (score: number): { tier: CardTier; label: string } => {
  if (score >= 95) return { tier: "legend", label: "LEGEND" };
  if (score >= 85) return { tier: "elite", label: "ELITE" };
  if (score >= 75) return { tier: "athlete", label: "ATHLETE" };
  if (score >= 60) return { tier: "contender", label: "CONTENDER" };
  return { tier: "rookie", label: "ROOKIE" };
};

const sportAccents: Record<string, string> = {
  cricket: "142, 72%, 46%",    // green
  football: "217, 91%, 60%",   // blue
  gym: "0, 84%, 60%",          // red
  badminton: "271, 91%, 65%",  // purple
  basketball: "25, 95%, 53%",  // orange
  yoga: "188, 94%, 43%",       // cyan
};

const getSportEmoji = (sport: string): string => {
  const map: Record<string, string> = {
    cricket: "🏏", football: "⚽", gym: "💪",
    badminton: "🏸", basketball: "🏀", yoga: "🧘",
  };
  return map[sport.toLowerCase()] || "⚡";
};

const tierStyles: Record<CardTier, {
  border: string;
  shimmer: string;
  bg: string;
  glow: string;
}> = {
  rookie: {
    border: "border-slate-500/50",
    shimmer: "from-transparent via-slate-400/20 to-transparent",
    bg: "from-slate-900/90 to-slate-800/90",
    glow: "",
  },
  contender: {
    border: "border-blue-400/50",
    shimmer: "from-transparent via-blue-400/25 to-transparent",
    bg: "from-slate-900/90 to-blue-950/90",
    glow: "",
  },
  athlete: {
    border: "border-primary/60",
    shimmer: "from-transparent via-primary/30 to-transparent",
    bg: "from-slate-900/90 to-orange-950/90",
    glow: "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
  },
  elite: {
    border: "border-yellow-400/60",
    shimmer: "from-transparent via-yellow-300/35 to-transparent",
    bg: "from-slate-900/90 to-yellow-950/90",
    glow: "shadow-[0_0_30px_hsla(45,100%,50%,0.3)]",
  },
  legend: {
    border: "border-white/40",
    shimmer: "from-transparent via-white/40 to-transparent",
    bg: "from-slate-900/90 to-purple-950/90",
    glow: "shadow-[0_0_40px_hsla(280,100%,70%,0.4)]",
  },
};

const AthleteCard = ({
  score, armAlignment, hipPosition, timingSync,
  sport = "gym", username = "You", onShare, onContinue,
}: AthleteCardProps) => {
  const [revealed, setRevealed] = useState(false);
  const [shimmerDone, setShimmerDone] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const { tier, label } = getTier(score);
  const style = tierStyles[tier];
  const accentHsl = sportAccents[sport.toLowerCase()] || "23, 100%, 50%";

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 100);
    const t2 = setTimeout(() => setShimmerDone(true), 900);
    const t3 = setTimeout(() => setShowButtons(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const statBar = (label: string, value: number) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold tracking-widest text-muted-foreground w-10">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: revealed ? `${value}%` : "0%",
            backgroundColor: `hsl(${accentHsl})`,
          }}
        />
      </div>
      <span className="text-[10px] font-bold text-foreground w-6 text-right">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Card wrapper with 3D flip */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          perspective: "1000px",
          width: 200,
          height: 280,
        }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-out ${style.glow}`}
          style={{
            transformStyle: "preserve-3d",
            transform: revealed ? "rotateY(0deg)" : "rotateY(90deg) translateY(40px)",
          }}
        >
          {/* Card face */}
          <div
            className={`absolute inset-0 rounded-2xl border-2 ${style.border} bg-gradient-to-b ${style.bg} backdrop-blur-xl overflow-hidden`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Hexagonal pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Shimmer sweep */}
            {!shimmerDone && revealed && (
              <div
                className={`absolute inset-0 bg-gradient-to-r ${style.shimmer} z-10`}
                style={{
                  animation: "shimmer-sweep 0.8s ease-out forwards",
                }}
              />
            )}

            {/* Legend holographic shimmer */}
            {tier === "legend" && shimmerDone && (
              <div
                className="absolute inset-0 z-10 opacity-20"
                style={{
                  background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0000)",
                  backgroundSize: "400% 400%",
                  animation: "holo-shift 3s ease infinite",
                }}
              />
            )}

            {/* Elite gold particles */}
            {(tier === "elite" || tier === "legend") && shimmerDone && (
              <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: tier === "legend" ? "#fff" : "#fbbf24",
                      animation: `particle-float ${2 + Math.random() * 2}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center h-full px-4 py-4">
              {/* Top row: logo left, sport tag right */}
              <div className="w-full flex items-center justify-between mb-1">
                <p className="text-[9px] font-black tracking-[0.2em] text-foreground flex items-center"
                   style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  CAYDENCE
                  <span className="inline-block w-1 h-1 rounded-full bg-primary ml-0.5" />
                </p>
                <span
                  className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `hsl(${accentHsl} / 0.15)`,
                    color: `hsl(${accentHsl})`,
                    border: `1px solid hsl(${accentHsl} / 0.3)`,
                  }}
                >
                  {getSportEmoji(sport)} {sport.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              {/* Score */}
              <div className="flex-1 flex items-center justify-center">
                <span
                  className="text-7xl font-black leading-none"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: `linear-gradient(180deg, hsl(${accentHsl}), hsl(${accentHsl} / 0.7))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {score}
                </span>
              </div>

              {/* Stats */}
              <div className="w-full space-y-1.5 mb-3">
                {statBar("ARM", armAlignment)}
                {statBar("HIP", hipPosition)}
                {statBar("SYNC", timingSync)}
              </div>

              {/* Footer */}
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: `hsl(${accentHsl})` }}>
                  {username}
                </span>
                <span
                  className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: `hsl(${accentHsl} / 0.15)`,
                    color: `hsl(${accentHsl})`,
                    border: `1px solid hsl(${accentHsl} / 0.3)`,
                  }}
                >
                  {label}
                </span>
              </div>
            </div>

            {/* Legend animated border */}
            {tier === "legend" && shimmerDone && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-30"
                style={{
                  background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0000)",
                  backgroundSize: "400% 400%",
                  animation: "holo-shift 3s ease infinite",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMaskComposite: "xor",
                  padding: "2px",
                  borderRadius: "1rem",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div
        className={`flex gap-3 w-full max-w-[240px] transition-all duration-500 ${
          showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Button onClick={onShare} variant="outline" className="flex-1 gap-2 text-xs">
          <Share2 className="w-3.5 h-3.5" /> Share Card
        </Button>
        <Button onClick={onContinue} className="flex-1 gap-2 text-xs">
          Continue <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default AthleteCard;
