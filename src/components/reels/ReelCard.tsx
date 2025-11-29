import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Camera, Play, Pause, Trophy, Scan } from "lucide-react";
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
  userScore?: number; // User's best AI Match score for this reel (0-100)
}

// Progress ring component for avatar
const AvatarProgressRing = ({ score, children }: { score: number; children: React.ReactNode }) => {
  const size = 48; // Ring outer size
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const hasAttempted = score > 20;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG Progress Ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(51 65 85 / 0.6)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={hasAttempted ? "url(#orangeGradient)" : "rgb(71 85 105 / 0.5)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FF5C00" />
          </linearGradient>
        </defs>
      </svg>
      {/* Avatar centered inside */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const ReelCard = ({ reel, athleteId, onAnalyze, onOpenTips, onOpenLeaderboard, isVisible, userScore = 20 }: ReelCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes_count);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay when visible
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
    setSaved(!saved);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: reel.title,
      text: reel.description || '',
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="h-[90vh] w-full flex-shrink-0 snap-start snap-always flex items-center justify-center py-4">
      {/* Phone Frame Container */}
      <div className="relative w-[90vw] max-w-sm h-full rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Full-screen Video */}
        <video
          ref={videoRef}
          src={reel.video_url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
        />
        
        {/* Play/Pause Tap Area */}
        <button 
          onClick={togglePlay}
          className="absolute inset-0 z-10"
        >
          {/* Center Play/Pause Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-16 h-16 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center border border-white/20">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </div>
          </div>
        </button>

        {/* Top Left - AI Match Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center gap-2 shadow-lg shadow-orange-500/30">
            <span className="text-xs font-bold text-white">AI Match</span>
            <span className="text-sm font-black text-white">{userScore > 20 ? `${userScore}%` : '—'}</span>
          </div>
        </div>

        {/* Top Right - Trophy Leaderboard Icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); onOpenLeaderboard(reel); }}
          className="absolute top-4 right-4 z-20"
        >
          <div className="p-2 rounded-lg bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-[#FF7A00] transition-colors">
            <Trophy className="w-5 h-5 text-[#FF7A00]" />
          </div>
        </button>

        {/* Right Side - Engagement Buttons */}
        <div className="absolute right-3 top-1/3 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <button 
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-[#FF7A00]/30' : 'bg-slate-900/60 backdrop-blur-md'}`}>
              <Heart className={`w-6 h-6 transition-all ${liked ? 'text-[#FF7A00] fill-[#FF7A00] scale-110' : 'text-white group-hover:text-[#FF7A00]'}`} />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-lg">{formatCount(likesCount)}</span>
          </button>

          {/* Comments / Insights */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white group-hover:text-[#FF7A00] transition-colors" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-lg">{formatCount(reel.comments_count)}</span>
          </button>

          {/* Save */}
          <button 
            onClick={handleSave}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-[#FF7A00]/30' : 'bg-slate-900/60 backdrop-blur-md'}`}>
              <Bookmark className={`w-6 h-6 transition-all ${saved ? 'text-[#FF7A00] fill-[#FF7A00]' : 'text-white group-hover:text-[#FF7A00]'}`} />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-lg">{saved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share */}
          <button 
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white group-hover:text-[#FF7A00] transition-colors" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-lg">Share</span>
          </button>
        </div>

        {/* Bottom Gradient Overlay with Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent pt-20 pb-6 px-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-3">
            <AvatarProgressRing score={userScore}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center text-sm font-bold text-white">
                {reel.creator_initials}
              </div>
            </AvatarProgressRing>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white">{reel.creator_username}</p>
              <p className="text-xs text-gray-400">{reel.creator_title}</p>
            </div>
            <button 
              onClick={handleFollow}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isFollowing 
                  ? 'bg-[#FF7A00] text-white border border-[#FF7A00]' 
                  : 'border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="text-white font-bold text-base mb-1">{reel.title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {reel.description}
            {reel.hashtags && <span className="text-[#FF7A00]"> {reel.hashtags}</span>}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={(e) => { e.stopPropagation(); onOpenTips(reel); }}
              className="flex-1 h-11 justify-center gap-2 bg-slate-800/80 backdrop-blur-md border border-white/10 text-white hover:bg-slate-700/80"
            >
              <Scan className="w-4 h-4" />
              Analyze This Move
            </Button>
            <button 
              onClick={(e) => { e.stopPropagation(); onAnalyze(reel); }}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
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
