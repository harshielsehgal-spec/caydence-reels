import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Zap, X } from "lucide-react";
import AthleteCard from "@/components/reels/AthleteCard";
import type { CollectedCard } from "./CardCollectionModal";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CollectedCard;
  sport: string;
  onUpgrade: () => void;
}

const CardDetailModal = ({ isOpen, onClose, card, sport, onUpgrade }: CardDetailModalProps) => {
  const handleShare = async () => {
    const tier = card.tier.toUpperCase();
    const text = `I earned a ${tier} card on Caydence with ${card.score}% match! 🔥 #CaydenceReels`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Caydence Card", text }); } catch {}
    } else if (navigator.clipboard) {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  };

  const earnedDate = new Date(card.earnedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground p-0 overflow-hidden rounded-2xl">
        <div className="relative p-6 flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Card with subtle tilt animation */}
          <div
            className="mb-4"
            style={{
              animation: "card-tilt 3s ease-in-out infinite",
            }}
          >
            <AthleteCard
              score={card.score}
              armAlignment={card.breakdown.arm}
              hipPosition={card.breakdown.hip}
              timingSync={card.breakdown.sync}
              sport={sport}
              username="You"
              onShare={handleShare}
              onContinue={onClose}
            />
          </div>

          {/* Earned date */}
          <p className="text-xs text-muted-foreground mt-2">
            Earned {earnedDate}
          </p>

          {/* Score breakdown */}
          <div className="w-full mt-4 space-y-2">
            {[
              { label: "Arm Alignment", value: card.breakdown.arm },
              { label: "Hip Position", value: card.breakdown.hip },
              { label: "Timing Sync", value: card.breakdown.sync },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground font-semibold">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full mt-5">
            <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 text-xs">
              <Share2 className="w-3.5 h-3.5" /> Share Card 📤
            </Button>
            <Button onClick={onUpgrade} className="flex-1 gap-2 text-xs gradient-primary text-primary-foreground">
              <Zap className="w-3.5 h-3.5" /> Try to Upgrade ⚡
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailModal;
