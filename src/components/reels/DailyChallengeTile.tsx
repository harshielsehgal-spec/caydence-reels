import { useState } from "react";
import { Trophy, ChevronRight, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DailyChallengeTileProps {
  onJoinChallenge?: () => void;
  onNavigateToChallenge?: () => void;
  onCoinsEarned?: (amount: number) => void;
}

const DailyChallengeTile = ({ onJoinChallenge, onNavigateToChallenge, onCoinsEarned }: DailyChallengeTileProps) => {
  const [showModal, setShowModal] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleTileClick = () => {
    setShowModal(true);
  };

  const handleJoin = () => {
    setHasJoined(true);
    setShowModal(false);
    onJoinChallenge?.();
    onCoinsEarned?.(5);
    toast.success("+5 Coins for joining!", {
      description: "Good luck with the Daily Challenge!",
    });
    onNavigateToChallenge?.();
  };

  const handleSkip = () => {
    setShowModal(false);
    onNavigateToChallenge?.();
  };

  return (
    <>
      <div
        onClick={handleTileClick}
        className="relative rounded-xl overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-[0.98] active:scale-95 aspect-[3/4] col-span-2"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_hsl(var(--background))_100%)]" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 border-2 border-primary/50">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Daily Challenge</h3>
          <p className="text-sm text-muted-foreground mb-3">Beat Today's Score</p>
          <p className="text-xs text-muted-foreground/80 mb-4 max-w-[200px]">
            Try this drill and climb the leaderboard
          </p>
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            {hasJoined ? (
              <span className="text-primary">Joined ✓</span>
            ) : (
              <>
                <span>Join Now</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/90 px-2 py-1 rounded-full">
          <Coins className="w-3 h-3 text-primary-foreground" />
          <span className="text-[10px] font-bold text-primary-foreground">+5</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-foreground text-center">Join Challenge?</DialogTitle>
            <DialogDescription className="text-muted-foreground text-center pt-2">
              Earn extra Caydence Coins by joining today's challenge and competing on the leaderboard!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-1 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold text-foreground">+5 Coins</span>
            <span className="text-sm text-muted-foreground">for joining</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleJoin}
            >
              Join
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyChallengeTile;
