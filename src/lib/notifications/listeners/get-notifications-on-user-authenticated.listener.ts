import { userAuthenticated } from "@/lib/auth/reducer";
import { createAppListenerMiddleware } from "@/lib/create-app-listener-middleware";
import { getNotifications } from "../usecases/get-notifications.usecase";

const listener = createAppListenerMiddleware();

export const getNotificationsOnUserAuthenticated = () => {
  listener.startListening({
    actionCreator: userAuthenticated,
    effect: async (_, { dispatch }) => {
      dispatch(getNotifications());
    },
  });

  return listener.middleware;
};
