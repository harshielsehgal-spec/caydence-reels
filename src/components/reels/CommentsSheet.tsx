import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, MessageCircle, Send, Lightbulb } from "lucide-react";
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
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💯", label: "Perfect" },
  { emoji: "🤯", label: "Mind-blown" },
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

  const handleReaction = (emoji: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      name: "You",
      text: emoji,
      isUser: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="bg-card border-t border-border text-foreground rounded-t-3xl h-[75vh] flex flex-col p-0"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        <SheetHeader className="flex flex-row items-center justify-between px-4 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <SheetTitle className="text-foreground text-lg font-bold">Comments</SheetTitle>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </SheetHeader>

        {/* Pinned Tip */}
        <div className="flex items-center gap-2 mx-4 mt-3 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-primary font-medium">{pinnedTip}</p>
        </div>

        {/* Quick Reactions */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground mr-1">React:</span>
          {quickReactions.map((reaction) => (
            <button
              key={reaction.label}
              onClick={() => handleReaction(reaction.emoji)}
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all duration-200 text-lg"
            >
              {reaction.emoji}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                message.isUser 
                  ? 'gradient-primary text-primary-foreground' 
                  : 'bg-secondary text-foreground'
              }`}>
                {message.name[0]}
              </div>
              <div className={`max-w-[75%] ${message.isUser ? 'text-right' : ''}`}>
                <p className={`text-xs text-muted-foreground mb-1 ${message.isUser ? 'text-right' : ''}`}>
                  {message.name}
                </p>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  message.isUser 
                    ? 'gradient-primary text-primary-foreground rounded-br-md' 
                    : 'bg-secondary text-foreground rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment..."
              className="flex-1 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-full px-4"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              size="icon"
              className="h-10 w-10 rounded-full gradient-primary hover:opacity-90 disabled:opacity-50"
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
