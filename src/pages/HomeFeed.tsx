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
  const [fetchError, setFetchError] = useState<string | null>(null);
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
    setFetchError(null);
    try {
      const data = await fetchReels();
      setReels(data);
    } catch (err) {
      console.error("Failed to load feed:", err);
      setFetchError("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
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
      <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-28 bg-secondary rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-secondary rounded animate-pulse" />
                </div>
              </div>
              <div className="aspect-[4/5] bg-secondary rounded-xl animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-secondary rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-secondary rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-secondary rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center lg:pl-[220px] xl:pl-[240px]">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-foreground font-semibold">{fetchError}</p>
          <p className="text-sm text-muted-foreground">Check your connection and try again</p>
          <button
            onClick={loadReels}
            className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Retry
          </button>
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
