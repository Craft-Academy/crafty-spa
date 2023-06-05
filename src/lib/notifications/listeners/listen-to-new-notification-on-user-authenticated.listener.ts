import { userAuthenticated } from "@/lib/auth/reducer";
import { createAppListenerMiddleware } from "@/lib/create-app-listener-middleware";
import { onNewNotificationsReceived } from "./on-new-notification-received.listener";
import { NotificationGateway } from "../model/notification.gateway";

export const listener = createAppListenerMiddleware();

export const listenToNewNotificationsOnUserAuthenticated = ({
  notificationGateway,
}: {
  notificationGateway: NotificationGateway;
}) => {
  listener.startListening({
    actionCreator: userAuthenticated,
    effect: (_, { dispatch, getState }) => {
      onNewNotificationsReceived({
        dispatch,
        getState,
        notificationGateway,
      });
    },
  });

  return listener.middleware;
};
