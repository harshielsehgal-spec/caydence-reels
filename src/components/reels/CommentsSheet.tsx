import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, MessageCircle, Send } from "lucide-react";
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
        className="bg-slate-900 border-slate-800 text-white rounded-t-3xl h-[70vh] flex flex-col"
      >
        <SheetHeader className="flex flex-row items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
            <SheetTitle className="text-white text-lg font-bold">Chat</SheetTitle>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </SheetHeader>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                message.isUser 
                  ? 'bg-[#FF7A00]' 
                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
              }`}>
                {message.name[0]}
              </div>
              <div className={`max-w-[75%] ${message.isUser ? 'text-right' : ''}`}>
                <p className={`text-xs text-gray-400 mb-1 ${message.isUser ? 'text-right' : ''}`}>
                  {message.name}
                </p>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.isUser 
                    ? 'bg-[#FF7A00] text-white rounded-br-md' 
                    : 'bg-slate-800/80 text-gray-200 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus-visible:ring-[#FF7A00]"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-10 w-10 p-0 bg-[#FF7A00] hover:bg-[#FF5C00] disabled:opacity-50"
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