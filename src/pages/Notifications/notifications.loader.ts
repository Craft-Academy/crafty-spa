import { AppStore } from "@/lib/create-store";
import { markAllNotificationsAsRead } from "@/lib/notifications/usecases/mark-all-notifications-as-read.usecase";
import { LoaderFunction } from "react-router-dom";

export const createNotificationsLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    setTimeout(() => {
      store.dispatch(markAllNotificationsAsRead());
    }, 1000);
    return null;
  };
