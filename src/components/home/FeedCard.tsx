import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play } from "lucide-react";
import { Reel } from "@/lib/reels";
import { toast } from "@/hooks/use-toast";

interface FeedCardProps {
  reel: Reel;
  onReelClick?: (reel: Reel) => void;
  onShareClick?: (reel: Reel) => void;
  onCommentClick?: (reel: Reel) => void;
}

const FeedCard = ({ reel, onReelClick, onShareClick, onCommentClick }: FeedCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes_count);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({ title: isSaved ? "Removed from saved" : "Saved to your drills" });
  };

  return (
    <div className="bg-card border-b border-border/20">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{reel.creator_initials}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{reel.creator_username}</p>
            <p className="text-xs text-muted-foreground">{reel.creator_title}</p>
          </div>
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Video Thumbnail */}
      <button 
        onClick={() => onReelClick?.(reel)}
        className="relative w-full aspect-[4/5] bg-background/50 group"
      >
        <video 
          src={reel.video_url}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      </button>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-transform active:scale-90">
              <Heart 
                className={`w-6 h-6 ${isLiked ? "text-red-500 fill-red-500" : "text-foreground"}`} 
              />
            </button>
            <button onClick={() => onCommentClick?.(reel)} className="transition-transform active:scale-90">
              <MessageCircle className="w-6 h-6 text-foreground" />
            </button>
            <button onClick={() => onShareClick?.(reel)} className="transition-transform active:scale-90">
              <Send className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <button onClick={handleSave} className="transition-transform active:scale-90">
            <Bookmark 
              className={`w-6 h-6 ${isSaved ? "text-foreground fill-foreground" : "text-foreground"}`} 
            />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm text-foreground mb-1">
          {likeCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold text-foreground">{reel.creator_username}</span>{" "}
          <span className="text-foreground/90">{reel.description || reel.title}</span>
        </div>

        {/* Hashtags */}
        {reel.hashtags && (
          <p className="text-sm text-primary mt-1">{reel.hashtags}</p>
        )}

        {/* Comments */}
        {reel.comments_count > 0 && (
          <button 
            onClick={() => onCommentClick?.(reel)}
            className="text-sm text-muted-foreground mt-2"
          >
            View all {reel.comments_count} comments
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedCard;
