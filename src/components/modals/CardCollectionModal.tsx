import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AthleteCard from "@/components/reels/AthleteCard";
import CardDetailModal from "./CardDetailModal";

export interface CollectedCard {
  score: number;
  tier: string;
  breakdown: { arm: number; hip: number; sync: number };
  sport: string;
  earnedAt: string;
}

interface CardCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Record<string, CollectedCard>;
}

const allSports = [
  { id: "all", label: "All", emoji: "🔥" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

const getTierLabel = (score: number) => {
  if (score >= 95) return "LEGEND";
  if (score >= 85) return "ELITE";
  if (score >= 75) return "ATHLETE";
  if (score >= 60) return "CONTENDER";
  return "ROOKIE";
};

const CardCollectionModal = ({ isOpen, onClose, collection }: CardCollectionModalProps) => {
  const [filter, setFilter] = useState("all");
  const [detailCard, setDetailCard] = useState<{ sport: string; card: CollectedCard } | null>(null);
  const navigate = useNavigate();

  const earnedCards = Object.entries(collection);
  const totalCards = earnedCards.length;
  const bestScore = earnedCards.length > 0 ? Math.max(...earnedCards.map(([, c]) => c.score)) : 0;
  const topTier = bestScore > 0 ? getTierLabel(bestScore) : "—";

  const sportsToShow = filter === "all"
    ? allSports.filter(s => s.id !== "all")
    : allSports.filter(s => s.id === filter);

  const handleTryNow = () => {
    onClose();
    navigate("/");
  };

  const handleUpgrade = (sport: string) => {
    setDetailCard(null);
    onClose();
    navigate("/");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] bg-card border-border text-foreground p-0 overflow-hidden rounded-2xl">
          {/* Header */}
          <div className="p-5 pb-3 border-b border-border/30">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  My Cards
                </h2>
                <p className="text-xs text-muted-foreground">Your best performances</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-2 mt-3">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                {totalCards} Cards
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                Best: {bestScore > 0 ? `${bestScore}%` : "—"}
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                Top: {topTier}
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {allSports.map(s => (
                <button
                  key={s.id}
                  onClick={() => setFilter(s.id)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === s.id
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary/80 border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card grid */}
          <div className="p-4 overflow-y-auto max-h-[55vh]">
            {totalCards === 0 && filter === "all" ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-32 h-44 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl animate-pulse">❓</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">Your first card is one attempt away</p>
                <Button onClick={handleTryNow} className="gradient-primary text-primary-foreground gap-2">
                  Start Training →
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {sportsToShow.map(sport => {
                  const card = collection[sport.id];
                  if (card) {
                    return (
                      <button
                        key={sport.id}
                        onClick={() => setDetailCard({ sport: sport.id, card })}
                        className="flex justify-center transition-transform hover:scale-[1.03]"
                      >
                        <div className="transform scale-[0.75] origin-top">
                          <AthleteCard
                            score={card.score}
                            armAlignment={card.breakdown.arm}
                            hipPosition={card.breakdown.hip}
                            timingSync={card.breakdown.sync}
                            sport={sport.id}
                            username="You"
                            onShare={() => {}}
                            onContinue={() => {}}
                          />
                        </div>
                      </button>
                    );
                  } else {
                    return (
                      <div
                        key={sport.id}
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-secondary/20 py-8 gap-2"
                        style={{ minHeight: 210 }}
                      >
                        <span className="text-3xl">{sport.emoji}</span>
                        <span className="text-xs text-muted-foreground font-medium">Not attempted</span>
                        <button
                          onClick={handleTryNow}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Try Now →
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {detailCard && (
        <CardDetailModal
          isOpen={!!detailCard}
          onClose={() => setDetailCard(null)}
          card={detailCard.card}
          sport={detailCard.sport}
          onUpgrade={() => handleUpgrade(detailCard.sport)}
        />
      )}
    </>
  );
};

export default CardCollectionModal;
