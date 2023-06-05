import { AppDispatch, RootState } from "@/lib/create-store";
import { NotificationGateway } from "../model/notification.gateway";
import { notificationsSlice } from "../slices/notifications.slice";
import { Notification } from "../model/notification.entity";
import { selectAuthUserId } from "@/lib/auth/reducer";

export const onNewNotificationsReceived = ({
  dispatch,
  getState,
  notificationGateway,
}: {
  dispatch: AppDispatch;
  getState: () => RootState;
  notificationGateway: NotificationGateway;
}) => {
  const authUserId = selectAuthUserId(getState());
  notificationGateway.onNewNotificationReceived(
    authUserId,
    (notification: Notification) => {
      dispatch(notificationsSlice.actions.notificationReceived(notification));
    }
  );
};
