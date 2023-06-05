import { reducer as timelinesReducer } from "./timelines/reducer";
import { reducer as authReducer } from "./auth/reducer";
import { reducer as usersReducer } from "./users/reducer";
import { combineReducers } from "@reduxjs/toolkit";
import { notificationsSlice } from "./notifications/slices/notifications.slice";

export const rootReducer = combineReducers({
  timelines: timelinesReducer,
  auth: authReducer,
  users: usersReducer,
  notifications: notificationsSlice.reducer,
});
