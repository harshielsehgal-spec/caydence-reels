import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb, Target, Video, TrendingUp, Award } from "lucide-react";
import { Reel } from "@/lib/reels";
import { supabase } from "@/integrations/supabase/client";

interface AnalyzeTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId?: string;
}

interface AttemptStats {
  lastScore: number | null;
  bestScore: number | null;
  attemptsCount: number;
}

const AnalyzeTipsModal = ({ isOpen, onClose, reel, athleteId }: AnalyzeTipsModalProps) => {
  const [stats, setStats] = useState<AttemptStats>({ lastScore: null, bestScore: null, attemptsCount: 0 });

  useEffect(() => {
    if (isOpen && reel && athleteId) {
      fetchAttemptStats();
    }
  }, [isOpen, reel, athleteId]);

  const fetchAttemptStats = async () => {
    if (!reel || !athleteId) return;
    
    const { data, error } = await supabase
      .from('reel_attempts')
      .select('ai_match_score, created_at')
      .eq('reel_id', reel.id)
      .eq('athlete_id', athleteId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      setStats({ lastScore: null, bestScore: null, attemptsCount: 0 });
      return;
    }

    const attemptsCount = data.length;
    const lastScore = attemptsCount > 0 ? data[0].ai_match_score : null;
    const bestScore = attemptsCount > 0 ? Math.max(...data.map(d => d.ai_match_score)) : null;

    setStats({ lastScore, bestScore, attemptsCount });
  };

  const tips = [
    { icon: Video, text: "Keep the camera vertical and capture your full body" },
    { icon: Target, text: "Focus on mimicking the exact timing and movement" },
    { icon: TrendingUp, text: "Start slow, then build up to full speed" },
    { icon: Lightbulb, text: "Watch the original reel multiple times first" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#FF7A00]" />
            Coaching Tips
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Get guidance on how to nail this move
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Reel Info */}
          {reel && (
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center text-sm font-bold text-white">
                {reel.creator_initials}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{reel.title}</p>
                <p className="text-xs text-gray-400">by {reel.creator_username}</p>
              </div>
            </div>
          )}

          {/* Your Stats */}
          {stats.attemptsCount > 0 && (
            <div className="bg-gradient-to-r from-[#FF7A00]/10 to-[#FF5C00]/10 border border-[#FF7A00]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-sm font-semibold text-white">Your Progress</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-black text-[#FF7A00]">{stats.lastScore}%</p>
                  <p className="text-xs text-gray-400">Last Score</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#FF7A00]">{stats.bestScore}%</p>
                  <p className="text-xs text-gray-400">Best Score</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.attemptsCount}</p>
                  <p className="text-xs text-gray-400">Attempts</p>
                </div>
              </div>
            </div>
          )}

          {/* Tips List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Tips to improve your score</h4>
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-800/30 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-[#FF7A00]/20 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>

          {/* No Attempts Message */}
          {stats.attemptsCount === 0 && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-400">
                You haven't attempted this move yet. Tap the camera button to record your first attempt!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeTipsModal;
