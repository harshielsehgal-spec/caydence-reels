import ReelsExperience from "@/components/ReelsExperience";

// For demo purposes, using a mock athlete ID
// In production, this would come from authentication
const DEMO_ATHLETE_ID = "demo-athlete-123";

const Reels = () => {
  return <ReelsExperience athleteId={DEMO_ATHLETE_ID} />;
};

export default Reels;
