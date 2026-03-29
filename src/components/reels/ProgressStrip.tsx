import { TrendingUp } from "lucide-react";

interface ProgressStripProps {
  attempts: { score: number }[];
}

const ProgressStrip = ({ attempts }: ProgressStripProps) => {
  if (attempts.length === 0) return null;

  const isImproving = attempts.length >= 2 && attempts[attempts.length - 1].score > attempts[0].score;

  return (
    <div className="w-full mt-3">
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-semibold">Your Journey</span>
        {isImproving && <span className="text-xs text-primary">↑</span>}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {attempts.map((attempt, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full gradient-primary glow-orange" />
              <span className="text-[10px] text-foreground font-bold mt-1">{attempt.score}%</span>
              <span className="text-[9px] text-muted-foreground">#{i + 1}</span>
            </div>
            {i < attempts.length - 1 && (
              <div className="w-6 h-px bg-border flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStrip;
