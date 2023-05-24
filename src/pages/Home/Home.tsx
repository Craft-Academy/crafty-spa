import { TimelineDivider } from "@/components/TimelineDivider";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/lib/auth/reducer";
import { Timeline } from "@/components/Timeline";

export const Home = () => {
  const authUserId = useSelector(selectAuthUser);

  return (
    <>
      <TimelineDivider text="For you" />
      <Timeline userId={authUserId} />
    </>
  );
};
