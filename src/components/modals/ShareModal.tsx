import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Send, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl: string;
  reelTitle: string;
  onSendToDM?: (userId: string) => void;
}

const demoUsers = [
  { id: "1", name: "Rohit Sharma", avatar: "RS" },
  { id: "2", name: "Virat Kohli", avatar: "VK" },
  { id: "3", name: "MS Dhoni", avatar: "MD" },
  { id: "4", name: "Jasprit Bumrah", avatar: "JB" },
];

const ShareModal = ({ isOpen, onClose, reelUrl, reelTitle, onSendToDM }: ShareModalProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reelUrl);
      toast({ title: "Link copied – share with friends" });
      onClose();
    } catch {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  const handleSendToUser = (userId: string, userName: string) => {
    setSelectedUser(userId);
    onSendToDM?.(userId);
    toast({ title: `Reel shared with ${userName}` });
    setTimeout(() => {
      setSelectedUser(null);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/30 max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Share</DialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Copy Link Option */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Copy className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Copy Link</p>
              <p className="text-sm text-muted-foreground">Share anywhere</p>
            </div>
          </button>

          {/* Send to Users */}
          <div>
            <p className="text-sm text-muted-foreground mb-3 px-1">Send to</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSendToUser(user.id, user.name)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                    selectedUser === user.id 
                      ? "bg-primary/20 ring-2 ring-primary" 
                      : "bg-background/50 hover:bg-background/80"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.avatar}
                  </div>
                  <span className="font-medium text-foreground">{user.name}</span>
                  <Send className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
