import { AppStore } from "@/lib/create-store";
import { getUser } from "@/lib/users/usecases/get-user.usecase";
import { LoaderFunction } from "react-router-dom";

export const createProfileLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;

    store.dispatch(getUser({ userId }));
    return null;
  };
