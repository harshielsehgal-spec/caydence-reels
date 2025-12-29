import ReelsExperience from "@/components/ReelsExperience";
import BottomNav from "@/components/navigation/BottomNav";

const DEMO_ATHLETE_ID = "demo-athlete-123";

const Reels = () => {
  return (
    <div className="relative">
      <ReelsExperience athleteId={DEMO_ATHLETE_ID} />
      <BottomNav />
    </div>
  );
};

export default Reels;
