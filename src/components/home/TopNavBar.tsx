import { Send, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopNavBarProps {
  coins?: number;
}

const TopNavBar = ({ coins = 150 }: TopNavBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          Caydence
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{coins}</span>
          </div>

          {/* Messages */}
          <button 
            onClick={() => navigate("/messages")}
            className="relative p-2 text-foreground hover:text-primary transition-colors"
          >
            <Send className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
