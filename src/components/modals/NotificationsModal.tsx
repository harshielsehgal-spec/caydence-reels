import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationsModal = ({ isOpen, onClose, athleteId, onUnreadCountChange }: NotificationsModalProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("athlete_id", athleteId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ read: true } as any)
      .eq("athlete_id", athleteId)
      .eq("read", false);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onUnreadCountChange?.(0);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications().then(() => {
        // Mark all as read after a short delay
        setTimeout(markAllRead, 500);
      });
    }
  }, [isOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "score": return "🏆";
      case "card": return "🃏";
      case "coins": return "🪙";
      case "challenge": return "⚡";
      default: return "🔔";
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground p-0 overflow-hidden rounded-2xl max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-['Space_Grotesk']">Notifications</h2>
          </div>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
          {notifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold text-base mb-1">No notifications yet</p>
              <p className="text-muted-foreground text-sm text-center">
                Complete attempts to earn notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-4 transition-colors ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="text-lg mt-0.5">{getTypeIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{notif.message}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{formatTime(notif.created_at)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
