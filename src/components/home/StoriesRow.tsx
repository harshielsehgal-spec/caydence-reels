import { Trophy, User, Flame } from "lucide-react";

interface Story {
  id: string;
  type: "challenge" | "coach" | "trending";
  title: string;
  avatar: string;
  hasNewContent: boolean;
}

const stories: Story[] = [
  { id: "1", type: "challenge", title: "Daily", avatar: "🏆", hasNewContent: true },
  { id: "2", type: "coach", title: "Coach RK", avatar: "RK", hasNewContent: true },
  { id: "3", type: "trending", title: "Trending", avatar: "🔥", hasNewContent: true },
  { id: "4", type: "coach", title: "Coach VK", avatar: "VK", hasNewContent: false },
  { id: "5", type: "challenge", title: "Weekly", avatar: "⭐", hasNewContent: true },
  { id: "6", type: "coach", title: "Coach MS", avatar: "MS", hasNewContent: false },
];

interface StoriesRowProps {
  onStoryClick?: (story: Story) => void;
}

const StoriesRow = ({ onStoryClick }: StoriesRowProps) => {
  return (
    <div className="py-4 px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onStoryClick?.(story)}
            className="flex flex-col items-center gap-2 min-w-[72px]"
          >
            <div className={`relative w-16 h-16 rounded-full p-[2px] ${
              story.hasNewContent 
                ? "bg-gradient-to-br from-primary via-orange-500 to-primary" 
                : "bg-border/50"
            }`}>
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                {story.type === "challenge" ? (
                  <span className="text-2xl">{story.avatar}</span>
                ) : story.type === "trending" ? (
                  <span className="text-2xl">{story.avatar}</span>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-orange-600/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{story.avatar}</span>
                  </div>
                )}
              </div>
              {story.hasNewContent && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  {story.type === "challenge" ? (
                    <Trophy className="w-3 h-3 text-white" />
                  ) : story.type === "trending" ? (
                    <Flame className="w-3 h-3 text-white" />
                  ) : (
                    <User className="w-3 h-3 text-white" />
                  )}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[72px]">
              {story.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesRow;
