import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Reel } from "@/lib/reels";

// Demo data for sports categories
const sportCategories: Record<string, string> = {
  "Bowling Masterclass": "Cricket",
  "Perfect Yorker": "Cricket",
  "Spin Technique": "Cricket",
};

interface ReelTileProps {
  reel: Reel;
  isLarge?: boolean;
  onClick: (reel: Reel) => void;
}

const ReelTile = ({ reel, isLarge = false, onClick }: ReelTileProps) => {
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getSportCategory = (title: string): string => {
    return sportCategories[title] || "Fitness";
  };

  // Generate demo view counts
  const getViewCount = (reelId: string): number => {
    const hash = reelId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return (hash % 50 + 1) * 100 + Math.floor(Math.random() * 500);
  };

  const heightClass = isLarge ? "aspect-[3/4]" : "aspect-[4/5]";

  return (
    <div
      onClick={() => onClick(reel)}
      className={`relative rounded-xl overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-[0.98] active:scale-95 ${heightClass}`}
    >
      {/* Video Thumbnail */}
      <video
        src={reel.video_url}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      {/* Sport Badge */}
      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-semibold border-0">
        {getSportCategory(reel.title)}
      </Badge>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        {/* Coach Info */}
        <div className="flex items-center gap-1.5 mb-1">
          <Avatar className="w-5 h-5 border border-primary/50">
            <AvatarFallback className="bg-secondary text-[8px] text-foreground">
              {reel.creator_initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-foreground/90 font-medium truncate max-w-[80px]">
            @{reel.creator_username}
          </span>
        </div>

        {/* Title */}
        <p className="text-xs text-foreground font-semibold truncate">{reel.title}</p>
      </div>

      {/* View Count */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
        <Eye className="w-3 h-3 text-foreground/80" />
        <span className="text-[10px] text-foreground/80 font-medium">
          {formatViewCount(getViewCount(reel.id))}
        </span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

export default ReelTile;
