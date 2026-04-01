import { useState } from "react";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";

const TryPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    // Navigate to reels with upload intent
    navigate("/", { state: { uploadMode: true } });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Try a Drill</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <div className="bg-gradient-to-br from-primary/20 to-orange-600/20 rounded-2xl p-6 border border-primary/30">
          <h2 className="text-lg font-bold text-foreground mb-2">How It Works</h2>
          <ol className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-xs">1</span>
              <span>Pick a drill from the Reels feed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-xs">2</span>
              <span>Record yourself trying the same move</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-xs">3</span>
              <span>Upload and get your AI Match score</span>
            </li>
          </ol>
        </div>

        {/* Upload Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Upload Your Attempt</h3>
          
          {selectedFile ? (
            <div className="relative bg-card rounded-xl p-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <p className="text-foreground font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={handleUpload}
                className="mt-4 w-full py-3 rounded-xl bg-primary text-white font-semibold"
              >
                Analyze Move
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card/50 border border-dashed border-border/50 cursor-pointer hover:bg-card transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Record Video</span>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <label className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card/50 border border-dashed border-border/50 cursor-pointer hover:bg-card transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Upload File</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Browse Drills CTA */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-xl border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-colors"
        >
          Browse Drills First
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default TryPage;
