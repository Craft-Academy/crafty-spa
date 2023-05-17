import { AppStore } from "@/lib/create-store";
import { getAuthUserTimeline } from "@/lib/timelines/usecases/get-auth-user-timeline.usecase";
import { LoaderFunction } from "react-router-dom";

export const createHomeLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    store.dispatch(getAuthUserTimeline());

    return null;
  };
