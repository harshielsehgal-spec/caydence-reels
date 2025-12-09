import { useState, useEffect } from "react";
import { Coins } from "lucide-react";

interface CoinsHeaderProps {
  coins: number;
  pendingAnimation?: number | null;
  onAnimationComplete?: () => void;
}

interface FloatingCoin {
  id: number;
  amount: number;
}

const CoinsHeader = ({ coins, pendingAnimation, onAnimationComplete }: CoinsHeaderProps) => {
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [displayCoins, setDisplayCoins] = useState(coins);

  useEffect(() => {
    if (pendingAnimation && pendingAnimation > 0) {
      const newFloating: FloatingCoin = {
        id: Date.now(),
        amount: pendingAnimation,
      };
      setFloatingCoins((prev) => [...prev, newFloating]);

      // Animate coin count after a short delay
      setTimeout(() => {
        setDisplayCoins(coins);
      }, 300);

      // Remove floating coin after animation
      setTimeout(() => {
        setFloatingCoins((prev) => prev.filter((f) => f.id !== newFloating.id));
        onAnimationComplete?.();
      }, 1500);
    } else {
      setDisplayCoins(coins);
    }
  }, [coins, pendingAnimation, onAnimationComplete]);

  return (
    <div className="relative flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5">
      <Coins className="w-4 h-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{displayCoins}</span>

      {/* Floating animations */}
      {floatingCoins.map((floating) => (
        <div
          key={floating.id}
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none animate-float-up"
          style={{
            animation: "floatUp 1.5s ease-out forwards",
          }}
        >
          <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            +{floating.amount}
            <Coins className="w-3 h-3" />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinsHeader;
