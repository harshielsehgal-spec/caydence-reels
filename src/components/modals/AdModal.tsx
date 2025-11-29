import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const AD_VIDEO_SRC = "/videos/aaravii.mp4";

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AdModal = ({ isOpen, onComplete }: AdModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    videoRef.current?.play();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-lg p-0 bg-black border-slate-700 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin" />
            </div>
          )}
          <video
            ref={videoRef}
            src={AD_VIDEO_SRC}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            onCanPlay={handleCanPlay}
            playsInline
            autoPlay
          />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">Watch to unlock your extra attempt</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdModal;
