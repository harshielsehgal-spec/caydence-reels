import { useState } from "react";
import { Target, Flame, Zap, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Quest {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: number;
  total: number;
  coins: number;
  completed: boolean;
}

interface QuestStripProps {
  onCoinsEarned?: (amount: number) => void;
}

const QuestStrip = ({ onCoinsEarned }: QuestStripProps) => {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      icon: <Target className="w-4 h-4 text-primary" />,
      title: "Complete 3 attempts",
      description: "Upload and analyze 3 attempts on any challenge today to earn coins.",
      progress: 2,
      total: 3,
      coins: 10,
      completed: false,
    },
    {
      id: "2",
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      title: "Hit 85%+ FormScore",
      description: "Achieve an AI match score of 85% or higher on any drill.",
      progress: 0,
      total: 1,
      coins: 15,
      completed: false,
    },
    {
      id: "3",
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
      title: "Try a new sport drill",
      description: "Explore and attempt a drill from a sport you haven't tried yet.",
      progress: 0,
      total: 1,
      coins: 20,
      completed: false,
    },
  ]);

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleMarkComplete = (quest: Quest) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === quest.id ? { ...q, completed: true, progress: q.total } : q
      )
    );
    setSelectedQuest(null);
    onCoinsEarned?.(quest.coins);
    toast.success(`+${quest.coins} Coins Awarded!`, {
      description: quest.title,
    });
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-foreground">Daily Quests</span>
          <span className="text-xs text-muted-foreground">Earn coins</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {quests.map((quest) => (
            <button
              key={quest.id}
              onClick={() => setSelectedQuest(quest)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                quest.completed
                  ? "bg-primary/20 border border-primary/50"
                  : "bg-secondary/80 border border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-background/50 flex items-center justify-center">
                {quest.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-xs font-medium ${quest.completed ? "text-primary" : "text-foreground"}`}>
                  {quest.title}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] text-muted-foreground">{quest.coins}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedQuest?.icon}
              <DialogTitle className="text-foreground">{selectedQuest?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground pt-2">
              {selectedQuest?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {selectedQuest?.progress}/{selectedQuest?.total}
                </span>
              </div>
              <Progress
                value={selectedQuest ? (selectedQuest.progress / selectedQuest.total) * 100 : 0}
                className="h-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">+{selectedQuest?.coins} Coins</span>
              </div>
              {!selectedQuest?.completed && (
                <Button
                  size="sm"
                  onClick={() => selectedQuest && handleMarkComplete(selectedQuest)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Mark Complete
                </Button>
              )}
              {selectedQuest?.completed && (
                <span className="text-sm text-primary font-medium">Completed ✓</span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestStrip;
