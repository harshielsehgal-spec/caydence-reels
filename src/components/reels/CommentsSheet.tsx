import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, MessageCircle } from "lucide-react";

interface Comment {
  name: string;
  score: string;
  text: string;
}

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleComments: Comment[] = [
  {
    name: "Aarya",
    score: "91% match",
    text: "now, this drill fixed my run-up."
  },
  {
    name: "Kabir",
    score: "88% match",
    text: "Release timing finally clicked after 3 attempts 👌"
  },
  {
    name: "Riya",
    score: "85% match",
    text: "Please add a spin variation of this drill!"
  },
  {
    name: "Dev",
    score: "92% match",
    text: "The slow-mo breakdown really helps understand the mechanics."
  },
  {
    name: "Priya",
    score: "87% match",
    text: "This is exactly what I needed to improve my follow-through!"
  },
  {
    name: "Arjun",
    score: "90% match",
    text: "Been practicing this for a week, seeing real improvement 🔥"
  }
];

const CommentsSheet = ({ isOpen, onClose }: CommentsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="bg-slate-900 border-slate-800 text-white rounded-t-3xl max-h-[70vh] overflow-y-auto"
      >
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
            <SheetTitle className="text-white text-lg font-bold">Athlete Insights</SheetTitle>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </SheetHeader>

        <div className="space-y-3 pb-4">
          {sampleComments.map((comment, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5C00] flex items-center justify-center text-xs font-bold text-white">
                  {comment.name[0]}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white">{comment.name}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="text-[#FF7A00] text-sm font-medium">{comment.score}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-10">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsSheet;
