import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface OnboardingModalProps {
  onComplete: (selectedSports: string[]) => void;
}

const sports = [
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSport = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    localStorage.setItem("caydence_onboarded", "true");
    localStorage.setItem("caydence_sports", JSON.stringify(selected));
    onComplete(selected);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6 flex flex-col items-center">
        {step === 1 ? (
          /* ── Screen 1: Welcome ── */
          <div className="flex flex-col items-center text-center animate-fade-in">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center glow-orange mb-8">
              <span className="text-3xl font-black text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                C
              </span>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Welcome to Caydence
            </h1>

            <p className="text-muted-foreground text-base mb-12">
              Match the move. Beat the score.
            </p>

            <Button
              onClick={() => setStep(2)}
              className="w-full h-14 text-base font-bold rounded-2xl gradient-primary text-primary-foreground glow-orange"
            >
              Continue
            </Button>
          </div>
        ) : (
          /* ── Screen 2: Sport Selection ── */
          <div className="flex flex-col items-center w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Pick your sports
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Select at least one to personalize your feed
            </p>

            <div className="grid grid-cols-3 gap-3 w-full mb-10">
              {sports.map((sport) => {
                const isSelected = selected.includes(sport.id);
                return (
                  <button
                    key={sport.id}
                    onClick={() => toggleSport(sport.id)}
                    className={`relative flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-[1.03]"
                        : "border-border bg-secondary/30 hover:border-border/60"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                      {sport.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleFinish}
              disabled={selected.length === 0}
              className={`w-full h-14 text-base font-bold rounded-2xl transition-all ${
                selected.length > 0
                  ? "gradient-primary text-primary-foreground glow-orange"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
            >
              Get Started
            </Button>

            <p className="text-[11px] text-muted-foreground/50 mt-4">
              You can change this later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
