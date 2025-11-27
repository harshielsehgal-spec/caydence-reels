import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Camera, Play, Scan, ChevronRight } from "lucide-react";
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

  return (
    <div className="h-full w-full flex-shrink-0 snap-start snap-always flex flex-col pt-12 pb-6">
      {/* Video Frame Container - 9:16 aspect */}
      <div className="relative flex-1 mx-3 rounded-2xl overflow-hidden bg-card border border-border/20">
        
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/60 flex items-center justify-center">
          {/* Play Button Overlay */}
          <button className="w-20 h-20 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center border border-foreground/10 hover:scale-105 transition-transform">
            <Play className="w-8 h-8 text-foreground fill-foreground ml-1" />
          </button>
          
          {/* Simulated Video Content Shapes */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-32 h-48 border-2 border-dashed border-foreground/30 rounded-lg" />
          </div>
        </div>

        {/* AI Match Score Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full gradient-primary flex items-center gap-2 shadow-lg glow-orange">
            <span className="text-xs font-bold text-primary-foreground">AI Match</span>
            <span className="text-sm font-black text-primary-foreground">{reel.matchScore}%</span>
          </div>
        </div>

        {/* Wireframe Analysis Icon */}
        <div className="absolute top-4 right-16 p-2 rounded-lg bg-background/20 backdrop-blur-md border border-foreground/10">
          <Scan className="w-5 h-5 text-primary" />
        </div>

        {/* Right Side Engagement Icons */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
          {/* Like */}
          <button 
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-primary/20' : 'bg-background/20 backdrop-blur-md'}`}>
              <Heart className={`w-6 h-6 transition-all ${liked ? 'text-primary fill-primary scale-110' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground">{reel.likes}</span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground">{reel.comments}</span>
          </button>

          {/* Save */}
          <button 
            onClick={() => setSaved(!saved)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-primary/20' : 'bg-background/20 backdrop-blur-md'}`}>
              <Bookmark className={`w-6 h-6 transition-all ${saved ? 'text-primary fill-primary' : 'text-foreground group-hover:text-primary'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground">Save</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-foreground">Share</span>
          </button>
        </div>

        {/* Bottom Left - Caption & Creator */}
        <div className="absolute left-4 right-20 bottom-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {reel.creator.initials}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{reel.creator.username}</p>
              <p className="text-xs text-muted-foreground">{reel.creator.title}</p>
            </div>
            <button className="ml-2 px-3 py-1 rounded-full border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-sm text-foreground leading-relaxed">
            {reel.caption}
            <span className="text-primary"> {reel.hashtags}</span>
          </p>
        </div>
      </div>

      {/* Bottom Actions - Below Video */}
      <div className="px-4 pt-4 space-y-3">
        {/* Analyze Button */}
        <Button variant="glass" className="w-full h-12 justify-center gap-2">
          <Scan className="w-5 h-5" />
          Analyze This Move
        </Button>

        {/* Try This Drill CTA */}
        <Button variant="hero" className="w-full h-14 justify-center gap-2 text-base">
          Try This Drill
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const Reels = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* iPhone 16 Pro Max Container - 430x932 aspect approximation */}
      <div className="relative w-full max-w-[430px] h-[90vh] max-h-[932px] bg-background rounded-[2.5rem] overflow-hidden border border-border/30 shadow-2xl">
        
        {/* Status Bar Simulation */}
        <div className="absolute top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-8 pt-2 bg-gradient-to-b from-background to-transparent">
          <span className="text-xs font-medium text-foreground/80">9:41</span>
          <div className="w-32 h-8 bg-background rounded-full" /> {/* Dynamic Island */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 rounded-sm border border-foreground/60" />
          </div>
        </div>

        {/* Scrollable Reels Container */}
        <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {reelsData.map((reel) => (
            <div key={reel.id} className="h-full">
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>

        {/* Floating Camera Upload Button */}
        <button className="absolute bottom-24 right-6 w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-xl glow-orange hover:scale-110 active:scale-95 transition-transform z-50">
          <Camera className="w-7 h-7 text-primary-foreground" />
        </button>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-foreground/30 z-50" />
      </div>
    </div>
  );
};

export default Reels;
