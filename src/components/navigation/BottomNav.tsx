import { Home, Search, PlusCircle, Film, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusCircle, label: "Try", path: "/try" },
  { icon: Film, label: "Reels", path: "/" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile: bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/30 lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center rounded-lg transition-all duration-200",
                  "hover:bg-primary/10 active:scale-95",
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

      {/* Desktop: left sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-[220px] xl:w-[240px] bg-background/95 backdrop-blur-lg border-r border-border/30 flex-col py-8 px-4">
        {/* Logo */}
        <div className="mb-10 px-3">
          <h1 className="text-xl font-black gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Caydence
          </h1>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left min-h-[44px]",
                  "hover:bg-primary/10",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                    item.label === "Try" && "text-primary"
                  )}
                  fill={isActive && item.label !== "Try" ? "currentColor" : "none"}
                />
                <span className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
