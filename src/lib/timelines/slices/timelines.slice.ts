import { EntityState, createSlice } from "@reduxjs/toolkit";
import {
  getAuthUserTimeline,
  getAuthUserTimelinePending,
} from "../usecases/get-auth-user-timeline.usecase";
import { Timeline, timelinesAdapter } from "../model/timeline.entity";
import { RootState } from "@/lib/create-store";

export type TimelinesSliceState = EntityState<Timeline> & {
  loadingTimelinesByUser: { [userId: string]: boolean };
};

export const timelinesSlice = createSlice({
  name: "timelines",
  initialState: timelinesAdapter.getInitialState({
    loadingTimelinesByUser: {},
  }) as TimelinesSliceState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimelinePending, (state, action) => {
      state.loadingTimelinesByUser[action.payload.authUser] = true;
    });
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      const timeline = action.payload;
      timelinesAdapter.addOne(state, {
        id: timeline.id,
        user: timeline.user,
        messages: timeline.messages.map((m) => m.id),
      });
      state.loadingTimelinesByUser[timeline.user] = false;
    });
  },
});

export const selectTimeline = (timelineId: string, state: RootState) =>
  timelinesAdapter
    .getSelectors()
    .selectById(state.timelines.timelines, timelineId);

export const selectIsUserTimelineLoading = (user: string, state: RootState) =>
  state.timelines.timelines.loadingTimelinesByUser[user] ?? false;

export const selectTimelineForUser = (user: string, state: RootState) =>
  timelinesAdapter
    .getSelectors()
    .selectAll(state.timelines.timelines)
    .filter((t) => t.user === user)[0];
