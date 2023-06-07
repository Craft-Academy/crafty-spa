import { AppDispatch, RootState } from "@/lib/create-store";
import {
  selectAreNotificationsLoading,
  selectNotifications,
} from "@/lib/notifications/slices/notifications.slice";
import { markAllNotificationsAsRead } from "@/lib/notifications/usecases/mark-all-notifications-as-read.usecase";
import { format as timeAgo } from "timeago.js";

export enum NotificationsViewModelType {
  NotificationsLoading = "NOTIFICATIONS_LOADING",
  NoNotifications = "NO_NOTIFICATIONS",
  NotificationsLoaded = "NOTIFICATIONS_LOADED",
}

export type NotificationsViewModel =
  | {
      type: NotificationsViewModelType.NotificationsLoading;
    }
  | {
      type: NotificationsViewModelType.NoNotifications;
      message: string;
    }
  | {
      type: NotificationsViewModelType.NotificationsLoaded;
      notifications: {
        id: string;
        title: string;
        text: string;
        occuredAt: string;
        url: string;
        read: boolean;
        imageUrl: string;
      }[];
      newNotifications: string;
      displayNewNotifications: () => void;
    };

export const createNotificationsViewModel =
  ({
    now,
    lastSeenNotificationId,
    setLastSeenNotificationId,
    dispatch,
  }: {
    now: Date;
    lastSeenNotificationId: string;
    setLastSeenNotificationId: (notificationId: string) => void;
    dispatch: AppDispatch;
  }) =>
  (rootState: RootState): NotificationsViewModel => {
    const areNotificationsLoading = selectAreNotificationsLoading(rootState);

    if (areNotificationsLoading) {
      return {
        type: NotificationsViewModelType.NotificationsLoading,
      };
    }

    const notifications = selectNotifications(rootState);

    if (notifications.length === 0) {
      return {
        type: NotificationsViewModelType.NoNotifications,
        message: "Aucune notification",
      };
    }

    notifications.sort(
      (n1, n2) =>
        new Date(n2.occuredAt).getTime() - new Date(n1.occuredAt).getTime()
    );

    const indexOfLastSeenNotification = notifications.findIndex(
      (n) => n.id === lastSeenNotificationId
    );

    if (indexOfLastSeenNotification === -1) {
      setLastSeenNotificationId(notifications[0].id);
    }

    return {
      type: NotificationsViewModelType.NotificationsLoaded,
      notifications: notifications
        .slice(
          indexOfLastSeenNotification === -1 ? 0 : indexOfLastSeenNotification
        )
        .map((n) => ({
          ...n,
          occuredAt: timeAgo(n.occuredAt, undefined, { relativeDate: now }),
        })),
      newNotifications:
        indexOfLastSeenNotification > 0
          ? `${indexOfLastSeenNotification} nouvelle(s) notification(s)`
          : "",
      displayNewNotifications() {
        setLastSeenNotificationId(notifications[0].id);
        dispatch(markAllNotificationsAsRead());
      },
    };
  };
