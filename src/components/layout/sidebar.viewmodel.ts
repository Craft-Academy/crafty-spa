import { RootState } from "@/lib/create-store";
import { selectNotifications } from "@/lib/notifications/slices/notifications.slice";

export const createSidebarViewModel = (rootState: RootState) => {
  const allNotifications = selectNotifications(rootState);

  const unreadNotifications = allNotifications.filter((n) => !n.read).length;
  const isThereNewNotifications = unreadNotifications > 0;

  return {
    notificationLabel: `Notifications${
      isThereNewNotifications ? ` (${unreadNotifications})` : ""
    }`,
    unreadNotifications: isThereNewNotifications,
  };
};
