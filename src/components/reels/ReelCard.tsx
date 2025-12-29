import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Camera, Play, Pause, Trophy, Scan, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reel } from "@/lib/reels";
import { toast } from "@/hooks/use-toast";
import CommentsSheet from "./CommentsSheet";

interface ReelCardProps {
  reel: Reel;
  athleteId?: string;
  onAnalyze: (reel: Reel) => void;
  onOpenTips: (reel: Reel) => void;
  onOpenLeaderboard: (reel: Reel) => void;
  isVisible: boolean;
  userScore?: number;
  isJoined?: boolean;
}

// Progress ring component for avatar
const AvatarProgressRing = ({ score, children }: { score: number; children: React.ReactNode }) => {
  const size = 44;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const hasAttempted = score > 20;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={hasAttempted ? "url(#orangeGradientRing)" : "hsl(var(--muted))"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="orangeGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(23, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(18, 100%, 48%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const ReelCard = ({ reel, athleteId, onAnalyze, onOpenTips, onOpenLeaderboard, isVisible, userScore = 20, isJoined = false }: ReelCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes_count);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    if (newSaved) {
      toast({ title: "Saved to your drills" });
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const shareData = {
      title: reel.title,
      text: "Check out this Caydence drill!",
      url: shareUrl,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed silently
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied." });
      } catch {
        // Clipboard failed silently
      }
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="h-screen w-full flex-shrink-0 snap-start snap-always flex items-center justify-center bg-background">
      {/* Mobile-first container - max-width for desktop centering like TikTok */}
      <div className="relative w-full max-w-[420px] h-full mx-auto">
        {/* Video fills container with rounded corners */}
        <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl">
          <video
            ref={videoRef}
            src={reel.video_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        </div>
        
        {/* Play/Pause overlay */}
        <button 
          onClick={togglePlay}
          className="absolute inset-0 z-10"
        >
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-16 h-16 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-foreground" />
              ) : (
                <Play className="w-7 h-7 text-foreground fill-foreground ml-1" />
              )}
            </div>
          </div>
        </button>

        {/* Top Bar - AI Match Badge & Trophy */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="px-3 py-1.5 rounded-full gradient-primary flex items-center gap-2 glow-orange">
            <span className="text-xs font-bold text-primary-foreground">AI Match</span>
            <span className="text-sm font-black text-primary-foreground">{userScore > 20 ? `${userScore}%` : '—'}</span>
          </div>
          
          {/* Trophy Icon - Top Right */}
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenLeaderboard(reel); }}
            className="relative w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-all group"
          >
            <Trophy className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            {isJoined && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </button>
        </div>

        {/* Right Side - Floating Action Bar */}
        <div className="absolute right-3 bottom-48 flex flex-col items-center gap-4 z-20">
          {/* Like */}
          <button 
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-primary/20' : 'bg-background/40 backdrop-blur-sm'}`}>
              <Heart className={`w-6 h-6 transition-all ${liked ? 'text-primary fill-primary scale-110' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">{formatCount(likesCount)}</span>
          </button>

          {/* Comments */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">{formatCount(reel.comments_count)}</span>
          </button>

          {/* Save */}
          <button 
            onClick={handleSave}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-primary/20' : 'bg-background/40 backdrop-blur-sm'}`}>
              <Bookmark className={`w-6 h-6 transition-all ${saved ? 'text-primary fill-primary' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">{saved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share */}
          <button 
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">Share</span>
          </button>
        </div>

        {/* Bottom Caption Module - Instagram style */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="relative px-4 pb-6 pt-16">
            {/* Creator Info Row */}
            <div className="flex items-center gap-3 mb-3">
              <AvatarProgressRing score={userScore}>
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {reel.creator_initials}
                </div>
              </AvatarProgressRing>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">@{reel.creator_username}</p>
                  <button 
                    onClick={handleFollow}
                    className={`px-3 py-0.5 rounded-md text-xs font-semibold transition-all ${
                      isFollowing 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{reel.creator_title}</p>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-foreground font-bold text-base mb-1">{reel.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {reel.description}
              {reel.hashtags && <span className="text-primary"> {reel.hashtags}</span>}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={(e) => { e.stopPropagation(); onOpenTips(reel); }}
                className="flex-1 h-11 justify-center gap-2 bg-secondary/80 backdrop-blur-sm border border-border text-foreground hover:bg-secondary"
              >
                <Scan className="w-4 h-4" />
                Analyze This Move
              </Button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAnalyze(reel); }}
                className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center glow-orange hover:scale-105 transition-transform"
              >
                <Camera className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Sheet */}
        <CommentsSheet 
          isOpen={isCommentsOpen} 
          onClose={() => setIsCommentsOpen(false)} 
        />
      </div>
    </div>
  );
};

export default ReelCard;
