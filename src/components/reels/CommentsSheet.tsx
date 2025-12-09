import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, MessageCircle, Send, Flame, ThumbsUp, Trophy, Sparkles, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  isUser?: boolean;
}

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickReactions = [
  { emoji: "🔥", icon: Flame, label: "Fire" },
  { emoji: "👏", icon: ThumbsUp, label: "Clap" },
  { emoji: "💯", icon: Trophy, label: "Perfect" },
  { emoji: "🤯", icon: Sparkles, label: "Mind-blown" },
];

const pinnedTip = "Coach Tip: Focus on wrist snap for better release.";

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    name: "Aarya",
    text: "Any tips for controlling the yorker length?",
  },
  {
    id: "2",
    name: "Coach Samir",
    text: "Focus on your release point and follow-through. Keep your eyes on the target till the end.",
  },
  {
    id: "3",
    name: "Kabir",
    text: "The slow-mo breakdown really helped me understand the arm rotation!",
  },
];

const CommentsSheet = ({ isOpen, onClose }: CommentsSheetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      name: "You",
      text: inputValue.trim(),
      isUser: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="bg-card border-border text-foreground rounded-t-3xl h-[70vh] flex flex-col"
      >
        <SheetHeader className="flex flex-row items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <SheetTitle className="text-foreground text-lg font-bold">Chat</SheetTitle>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </SheetHeader>

        {/* Pinned Tip */}
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-primary/10 border border-primary/30">
          <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-primary font-medium">{pinnedTip}</p>
        </div>

        {/* Quick Reactions */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
          <span className="text-xs text-muted-foreground mr-1">React:</span>
          {quickReactions.map((reaction) => (
            <button
              key={reaction.label}
              onClick={() => {
                const newMessage: ChatMessage = {
                  id: Date.now().toString(),
                  name: "You",
                  text: reaction.emoji,
                  isUser: true,
                };
                setMessages((prev) => [...prev, newMessage]);
              }}
              className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-200 text-base"
            >
              {reaction.emoji}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-foreground ${
                message.isUser 
                  ? 'bg-primary' 
                  : 'bg-gradient-to-r from-secondary to-muted'
              }`}>
                {message.name[0]}
              </div>
              <div className={`max-w-[75%] ${message.isUser ? 'text-right' : ''}`}>
                <p className={`text-xs text-muted-foreground mb-1 ${message.isUser ? 'text-right' : ''}`}>
                  {message.name}
                </p>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-secondary/80 text-foreground rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-10 w-10 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsSheet;