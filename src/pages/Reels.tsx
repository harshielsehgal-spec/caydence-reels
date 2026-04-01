import { useState } from "react";
import ReelsExperience from "@/components/ReelsExperience";
import BottomNav from "@/components/navigation/BottomNav";
import OnboardingModal from "@/components/modals/OnboardingModal";

const getAthleteId = (): string => {
  const key = "caydence_athlete_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

const DEMO_ATHLETE_ID = getAthleteId();

const Reels = () => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem("caydence_onboarded") !== "true"
  );
  const [preferredSports, setPreferredSports] = useState<string[]>(
    () => {
      try { return JSON.parse(localStorage.getItem("caydence_sports") || "[]"); }
      catch { return []; }
    }
  );

  const handleOnboardingComplete = (sports: string[]) => {
    setPreferredSports(sports);
    setShowOnboarding(false);
  };

  return (
    <div className="relative">
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      <ReelsExperience athleteId={DEMO_ATHLETE_ID} preferredSports={preferredSports} />
      <BottomNav />
    </div>
  );
};

export default Reels;
