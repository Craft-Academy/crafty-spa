import { createSlice } from "@reduxjs/toolkit";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";

type TimelinesState = {
  user: string;
  messages: {
    text: string;
    author: string;
    publishedAt: string;
  }[];
};

export const timelinesSlice = createSlice({
  name: "timelines",
  initialState: {} as TimelinesState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});
