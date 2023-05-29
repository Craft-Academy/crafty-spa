import { reducer as timelinesReducer } from "./timelines/reducer";
import { reducer as authReducer } from "./auth/reducer";
import { reducer as usersReducer } from "./users/reducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  timelines: timelinesReducer,
  auth: authReducer,
  users: usersReducer,
});
