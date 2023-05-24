import { AppStore } from "@/lib/create-store";
import { LoaderFunction } from "react-router-dom";

export const createProfileTimelineLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    return null;
  };
