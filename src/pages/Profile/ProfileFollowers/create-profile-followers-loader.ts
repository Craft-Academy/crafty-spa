import { AppStore } from "@/lib/create-store";
import { getUserFollowers } from "@/lib/users/usecases/get-followers.usecase";
import { LoaderFunction } from "react-router-dom";

export const createProfileFollowersLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserFollowers({ userId }));

    return null;
  };
