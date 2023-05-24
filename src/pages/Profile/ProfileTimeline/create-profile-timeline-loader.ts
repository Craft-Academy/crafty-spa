import { AppStore } from "@/lib/create-store";
import { getUserTimeline } from "@/lib/timelines/usecases/get-user-timeline.usecase";
import { LoaderFunction } from "react-router-dom";

export const createProfileTimelineLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserTimeline({ userId }));

    return null;
  };
