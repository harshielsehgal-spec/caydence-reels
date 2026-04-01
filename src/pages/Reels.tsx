import ReelsExperience from "@/components/ReelsExperience";
import BottomNav from "@/components/navigation/BottomNav";

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
  return (
    <div className="relative">
      <ReelsExperience athleteId={DEMO_ATHLETE_ID} />
      <BottomNav />
    </div>
  );
};

export default Reels;
