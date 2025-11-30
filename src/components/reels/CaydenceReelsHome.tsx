import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reel, fetchReels } from "@/lib/reels";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react";

// Demo data for sports categories
const sportCategories: Record<string, string> = {
  "Bowling Masterclass": "Cricket",
  "Perfect Yorker": "Cricket",
  "Spin Technique": "Cricket",
};

const CaydenceReelsHome = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    setIsLoading(true);
    const data = await fetchReels();
    setReels(data);
    setIsLoading(false);
  };

  const handleReelClick = (reel: Reel) => {
    console.log("Reel tapped:", reel.id);
    // Navigate to full-screen reels player (future integration)
    navigate("/");
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">Caydence</span> Reels
        </h1>
      </header>

      {/* Grid Container */}
      <div className="px-1 py-2">
        {reels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No reels available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {reels.map((reel, index) => {
              // Staggered heights for Instagram Explore feel
              const isLarge = index % 5 === 0;
              const heightClass = isLarge ? "aspect-[3/4]" : "aspect-[4/5]";
              
              return (
                <div
                  key={reel.id}
                  onClick={() => handleReelClick(reel)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-[0.98] active:scale-95 ${heightClass}`}
                >
                  {/* Video Thumbnail / Background */}
                  <video
                    src={reel.video_url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Sport Badge - Top Right */}
                  <Badge 
                    className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 font-semibold"
                  >
                    {getSportCategory(reel.title)}
                  </Badge>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    {/* Coach Info - Bottom Left */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Avatar className="w-5 h-5 border border-primary/50">
                        <AvatarFallback className="bg-slate-800 text-[8px] text-foreground">
                          {reel.creator_initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-white/90 font-medium truncate max-w-[80px]">
                        @{reel.creator_username}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <p className="text-xs text-white font-semibold truncate">
                      {reel.title}
                    </p>
                  </div>

                  {/* View Count - Bottom Right */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-1.5 py-0.5">
                    <Eye className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] text-white/80 font-medium">
                      {formatViewCount(getViewCount(reel.id))}
                    </span>
                  </div>

                  {/* Hover/Tap Overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaydenceReelsHome;
