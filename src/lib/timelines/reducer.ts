import { combineReducers } from "@reduxjs/toolkit";
import { timelinesSlice } from "./slices/timelines.slice";
import { messagesSlice } from "./slices/messages.slice";
import { likesSlice } from "./slices/likes.slice";

export const reducer = combineReducers({
  [timelinesSlice.name]: timelinesSlice.reducer,
  [messagesSlice.name]: messagesSlice.reducer,
  [likesSlice.name]: likesSlice.reducer,
});
