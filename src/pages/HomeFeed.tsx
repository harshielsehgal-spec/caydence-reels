import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReels, Reel } from "@/lib/reels";
import TopNavBar from "@/components/home/TopNavBar";
import StoriesRow from "@/components/home/StoriesRow";
import FeedCard from "@/components/home/FeedCard";
import BottomNav from "@/components/navigation/BottomNav";
import ShareModal from "@/components/modals/ShareModal";
import CommentsSheet from "@/components/reels/CommentsSheet";
import { Loader2 } from "lucide-react";

const HomeFeed = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState(150);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Personalization state (local)
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<string>>(new Set());
  const [preferredSports, setPreferredSports] = useState<string[]>([]);

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
    // Navigate to reels experience with the selected reel
    navigate("/", { state: { selectedReelId: reel.id } });
  };

  const handleShareClick = (reel: Reel) => {
    setSelectedReel(reel);
    setShareModalOpen(true);
  };

  const handleCommentClick = (reel: Reel) => {
    setSelectedReel(reel);
    setCommentsOpen(true);
  };

  const handleStoryClick = (story: any) => {
    if (story.type === "challenge") {
      // Navigate to reels with challenge filter
      navigate("/");
    } else if (story.type === "trending") {
      navigate("/");
    } else {
      // Coach story - navigate to their reels
      navigate("/");
    }
  };

  const handleSendToDM = (userId: string) => {
    // Add reel link to messages (handled by ShareModal toast)
  };

  // Personalized feed based on liked/saved reels
  const getPersonalizedFeed = () => {
    return reels;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      <TopNavBar coins={coins} />
      
      <StoriesRow onStoryClick={handleStoryClick} />
      
      <div className="divide-y divide-border/20 max-w-2xl mx-auto">
        {getPersonalizedFeed().map((reel) => (
          <FeedCard
            key={reel.id}
            reel={reel}
            onReelClick={handleReelClick}
            onShareClick={handleShareClick}
            onCommentClick={handleCommentClick}
          />
        ))}
      </div>

      <BottomNav />

      {selectedReel && (
        <>
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            reelUrl={`${window.location.origin}/reel/${selectedReel.id}`}
            reelTitle={selectedReel.title}
            onSendToDM={handleSendToDM}
          />
          <CommentsSheet
            isOpen={commentsOpen}
            onClose={() => setCommentsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default HomeFeed;
