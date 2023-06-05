import { selectAuthUserId } from "@/lib/auth/reducer";
import { createAppAsyncThunk } from "@/lib/create-app-thunk";

export const getNotifications = createAppAsyncThunk(
  "notifications/getNotifications",
  (_, { extra: { notificationGateway }, getState }) => {
    const authUserId = selectAuthUserId(getState());

    return notificationGateway.getNotifications({ authUserId });
  }
);
