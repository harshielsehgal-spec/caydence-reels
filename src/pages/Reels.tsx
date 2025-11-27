import { useState, useRef } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Camera, Play, Pause, Scan, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReelData {
  id: number;
  creator: {
    initials: string;
    username: string;
    title: string;
  };
  caption: string;
  hashtags: string;
  likes: string;
  comments: string;
  matchScore: number;
}

const reelsData: ReelData[] = [
  {
    id: 1,
    creator: { initials: "JD", username: "@jordan_dribbles", title: "Pro Trainer" },
    caption: "Master the crossover step-back 🏀 Perfect for creating space off the dribble",
    hashtags: "#basketball #skills #training",
    likes: "2.4K",
    comments: "186",
    matchScore: 92,
  },
  {
    id: 2,
    creator: { initials: "MK", username: "@maya_kicks", title: "Soccer Coach" },
    caption: "Inside-outside touch drill ⚽ Build your close control with this simple routine",
    hashtags: "#soccer #footwork #drills",
    likes: "5.1K",
    comments: "324",
    matchScore: 88,
  },
  {
    id: 3,
    creator: { initials: "TR", username: "@tennis_ryan", title: "ATP Player" },
    caption: "Perfect your serve toss 🎾 The key to a consistent serve starts here",
    hashtags: "#tennis #serve #technique",
    likes: "3.8K",
    comments: "215",
    matchScore: 95,
  },
  {
    id: 4,
    creator: { initials: "AS", username: "@alex_swims", title: "Olympic Coach" },
    caption: "Streamline position fundamentals 🏊 Reduce drag and swim faster",
    hashtags: "#swimming #technique #speed",
    likes: "1.9K",
    comments: "142",
    matchScore: 91,
  },
  {
    id: 5,
    creator: { initials: "LG", username: "@lisa_golf", title: "PGA Instructor" },
    caption: "Hip rotation drill for more power 🏌️ Generate effortless distance",
    hashtags: "#golf #swing #power",
    likes: "4.2K",
    comments: "298",
    matchScore: 87,
  },
];

const ReelCard = ({ reel }: { reel: ReelData }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="h-[90vh] w-full flex-shrink-0 snap-start snap-always flex items-center justify-center py-4">
      {/* Phone Frame Container */}
      <div className="relative w-full max-w-sm h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Full-screen Video */}
        <video
          ref={videoRef}
          src="/videos/bumrah_bowling_144.mp4"
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
          {/* Center Play/Pause Button - only visible when paused or on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-16 h-16 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center border border-foreground/20">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-foreground" />
              ) : (
                <Play className="w-7 h-7 text-foreground fill-foreground ml-1" />
              )}
            </div>
          </div>
        </button>

        {/* Top Left - AI Match Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1.5 rounded-full gradient-primary flex items-center gap-2 shadow-lg glow-orange">
            <span className="text-xs font-bold text-primary-foreground">AI Match</span>
            <span className="text-sm font-black text-primary-foreground">{reel.matchScore}%</span>
          </div>
        </div>

        {/* Top Right - Analysis Icon */}
        <div className="absolute top-4 right-4 z-20">
          <div className="p-2 rounded-lg bg-background/30 backdrop-blur-md border border-foreground/10">
            <Scan className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Right Side - Engagement Buttons */}
        <div className="absolute right-3 top-1/3 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <button 
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-primary/30' : 'bg-background/30 backdrop-blur-md'}`}>
              <Heart className={`w-6 h-6 transition-all ${liked ? 'text-primary fill-primary scale-110' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">{reel.likes}</span>
          </button>

          {/* Comment */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">{reel.comments}</span>
          </button>

          {/* Save */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-primary/30' : 'bg-background/30 backdrop-blur-md'}`}>
              <Bookmark className={`w-6 h-6 transition-all ${saved ? 'text-primary fill-primary' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">Save</span>
          </button>

          {/* Share */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground drop-shadow-lg">Share</span>
          </button>
        </div>

        {/* Bottom Gradient Overlay with Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent pt-20 pb-6 px-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
              {reel.creator.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{reel.creator.username}</p>
              <p className="text-xs text-muted-foreground">{reel.creator.title}</p>
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1.5 rounded-full border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-sm text-foreground leading-relaxed mb-4">
            {reel.caption}
            <span className="text-primary"> {reel.hashtags}</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="glass" 
              className="flex-1 h-11 justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Scan className="w-4 h-4" />
              Analyze This Move
            </Button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center shadow-lg glow-orange hover:scale-105 transition-transform"
            >
              <Camera className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Scrollable Reels Feed */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {reelsData.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};

export default Reels;
