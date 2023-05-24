import { useParams } from "react-router-dom";
import { Timeline } from "@/components/Timeline";

export const ProfileTimeline = () => {
  const params = useParams();

  return <Timeline userId={params.userId as string} />;
};
