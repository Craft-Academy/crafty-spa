import { selectAuthUserId } from "@/lib/auth/reducer";
import { createAppAsyncThunk } from "@/lib/create-app-thunk";

export const markAllNotificationsAsRead = createAppAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { extra: { notificationGateway }, getState }) => {
    const authUserId = selectAuthUserId(getState());

    return notificationGateway.markAllNotificationsAsRead(authUserId);
  }
);
