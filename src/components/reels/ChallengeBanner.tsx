import { useState, useEffect } from "react";
import { Trophy, Users } from "lucide-react";

interface ChallengeBannerProps {
  creatorName: string;
  prizePool?: string;
  athleteCount?: number;
  endsInHours?: number;
}

const ChallengeBanner = ({ 
  creatorName, 
  prizePool = "₹5,000", 
  athleteCount = 124,
  endsInHours = 62 
}: ChallengeBannerProps) => {
  const [timeLeft, setTimeLeft] = useState(endsInHours * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);

  return (
    <div className="w-full px-3 py-2 rounded-xl bg-secondary/60 backdrop-blur-sm border border-border/50">
      <p className="text-xs text-muted-foreground mb-1.5">
        <span className="text-foreground font-semibold">@{creatorName}</span> challenges you to match this move
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Prize */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-primary">
          <Trophy className="w-3 h-3 text-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground">{prizePool} Prize Pool</span>
        </div>

        {/* Athletes */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="w-3 h-3" />
          <span className="text-xs">{athleteCount} attempting</span>
        </div>

        {/* Countdown */}
        <span className="text-xs text-muted-foreground ml-auto">
          Ends in <span className="text-foreground font-semibold">{days}d {hours}h {mins}m</span>
        </span>
      </div>
    </div>
  );
};

export default ChallengeBanner;
