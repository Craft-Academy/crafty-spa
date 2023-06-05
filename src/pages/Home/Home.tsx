import { TimelineDivider } from "@/components/TimelineDivider";
import { useSelector } from "react-redux";
import { selectAuthUserId } from "@/lib/auth/reducer";
import { Timeline } from "@/components/Timeline";

export const Home = () => {
  const authUserId = useSelector(selectAuthUserId);

  return (
    <>
      <TimelineDivider text="For you" />
      <Timeline userId={authUserId} />
    </>
  );
};
