import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Play, CreditCard } from "lucide-react";

interface AttemptGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onPay: () => void;
}

const AttemptGateModal = ({ isOpen, onClose, onWatchAd, onPay }: AttemptGateModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">No more attempts left</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            You've used your 3 free attempts for this challenge.
            Watch advertisement for one more attempt or pay ₹100.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onWatchAd}
              className="w-full h-12 bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] hover:from-[#FF8A20] hover:to-[#FF6C10] text-white font-semibold gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Advertisement
            </Button>

            <Button
              onClick={onPay}
              variant="outline"
              className="w-full h-12 border-slate-600 text-white hover:bg-slate-800 hover:text-white gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Pay ₹100
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttemptGateModal;
