import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, Loader2, Camera, Award } from "lucide-react";
import { Reel, uploadReelAttempt } from "@/lib/reels";
import { toast } from "@/hooks/use-toast";

interface UploadAttemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId: string;
}

const UploadAttemptModal = ({ isOpen, onClose, reel, athleteId }: UploadAttemptModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ score: number; coins: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({ title: "Please select a video file", variant: "destructive" });
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({ title: "File size must be under 100MB", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !reel) return;

    setIsUploading(true);
    const { success, score, coins, error } = await uploadReelAttempt(reel.id, athleteId, selectedFile);
    setIsUploading(false);

    if (success) {
      setResult({ score, coins });
      toast({ title: `Great attempt! You earned ${coins} coins! 🎉` });
    } else {
      toast({ title: error || "Upload failed", variant: "destructive" });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    onClose();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FF7A00]" />
            {result ? "Analysis Complete!" : "Upload Your Attempt"}
          </DialogTitle>
        </DialogHeader>

        {result ? (
          // Result View
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center shadow-lg shadow-orange-500/30">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">AI Match Score</p>
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF5C00]">
                  {result.score}%
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 mx-auto w-fit">
                <Award className="w-5 h-5 text-[#FF7A00]" />
                <span className="font-bold text-white">+{result.coins} Coins Earned</span>
              </div>

              {reel && (
                <p className="text-gray-400 text-sm">
                  Great work on "{reel.title}"! Keep practicing to improve your score.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={resetUpload}
                variant="outline"
                className="flex-1 border-slate-700 text-white hover:bg-slate-800"
              >
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] text-white hover:opacity-90"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          // Upload View
          <div className="space-y-4 py-4">
            {reel && (
              <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center text-sm font-bold text-white">
                  {reel.creator_initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{reel.title}</p>
                  <p className="text-xs text-gray-400">{reel.creator_username}</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden aspect-[9/16] max-h-[300px] bg-black">
                <video
                  src={previewUrl}
                  className="w-full h-full object-contain"
                  controls
                  muted
                />
                <button
                  onClick={resetUpload}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-[#FF7A00] transition-colors flex flex-col items-center justify-center gap-3 bg-slate-800/30"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#FF7A00]" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">Tap to upload video</p>
                  <p className="text-xs text-gray-400 mt-1">MP4, MOV up to 100MB</p>
                </div>
              </button>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full h-12 bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                "Upload & Analyze"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Our AI will compare your technique and give you a match score
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadAttemptModal;
