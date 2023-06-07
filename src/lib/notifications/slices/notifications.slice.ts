import { EntityState, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getNotifications } from "../usecases/get-notifications.usecase";
import { RootState } from "@/lib/create-store";
import {
  Notification,
  notificationsAdapter,
} from "../model/notification.entity";

type NotificationsSliceState = EntityState<Notification> & {
  loading: boolean;
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsAdapter.getInitialState({
    loading: false,
  }) as NotificationsSliceState,
  reducers: {
    notificationReceived(state, action: PayloadAction<Notification>) {
      notificationsAdapter.addOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        notificationsAdapter.addMany(state, action.payload);
      });
  },
});

export const selectAreNotificationsLoading = (state: RootState) =>
  state.notifications.loading;

export const selectNotifications = (state: RootState) =>
  notificationsAdapter.getSelectors().selectAll(state.notifications);
