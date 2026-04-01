import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  time: string;
}

const demoConversations: Conversation[] = [
  { id: "1", name: "Rohit Sharma", avatar: "RS", lastMessage: "Great form on that cover drive!", time: "2m", unread: true },
  { id: "2", name: "Virat Kohli", avatar: "VK", lastMessage: "Check out my new drill 🔥", time: "15m", unread: true },
  { id: "3", name: "MS Dhoni", avatar: "MD", lastMessage: "Keep practicing, you're improving!", time: "1h", unread: false },
  { id: "4", name: "Jasprit Bumrah", avatar: "JB", lastMessage: "That bowling action needs work", time: "3h", unread: false },
];

const demoMessages: Message[] = [
  { id: "1", text: "Hey! Saw your latest attempt on my drill", isOwn: false, time: "10:30 AM" },
  { id: "2", text: "Thanks coach! I've been practicing hard", isOwn: true, time: "10:32 AM" },
  { id: "3", text: "Great form on that cover drive!", isOwn: false, time: "10:35 AM" },
  { id: "4", text: "Any tips on improving my footwork?", isOwn: true, time: "10:36 AM" },
];

const MessagesPage = () => {
  const navigate = useNavigate();
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isOwn: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (selectedConvo) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedConvo(null)} className="p-2 -ml-2 text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{selectedConvo.avatar}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{selectedConvo.name}</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  msg.isOwn
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-card text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-white/70" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-background border-t border-border/20 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message..."
              className="flex-1 bg-card/50 border border-border/30 rounded-full py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </div>
      </header>

      {/* Conversations List */}
      <div className="p-4 space-y-2">
        {demoConversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => setSelectedConvo(convo)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card/50 transition-colors"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{convo.avatar}</span>
              </div>
              {convo.unread && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <p className={`font-semibold ${convo.unread ? "text-foreground" : "text-foreground/80"}`}>
                  {convo.name}
                </p>
                <span className={`text-xs ${convo.unread ? "text-primary" : "text-muted-foreground"}`}>
                  {convo.time}
                </span>
              </div>
              <p className={`text-sm truncate ${convo.unread ? "text-foreground" : "text-muted-foreground"}`}>
                {convo.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MessagesPage;
