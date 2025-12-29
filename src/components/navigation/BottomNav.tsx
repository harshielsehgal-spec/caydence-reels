import { Home, Search, PlusCircle, Film, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusCircle, label: "Try", path: "/try" },
  { icon: Film, label: "Reels", path: "/" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/30">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                "hover:bg-primary/10",
                isActive && "text-primary"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive ? "text-primary" : "text-muted-foreground",
                  item.label === "Try" && "w-7 h-7 text-primary"
                )} 
                fill={isActive && item.label !== "Try" ? "currentColor" : "none"}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
