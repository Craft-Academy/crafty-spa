import { EntityState, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAuthUserTimeline,
  getAuthUserTimelinePending,
} from "../usecases/get-auth-user-timeline.usecase";
import { Timeline, timelinesAdapter } from "../model/timeline.entity";
import { RootState } from "@/lib/create-store";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import { postMessage } from "../usecases/post-message.usecase";

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
    builder
      .addCase(getAuthUserTimelinePending, (state, action) => {
        setUserTimelineLoadingState(state, {
          userId: action.payload.authUser,
          loading: true,
        });
      })
      .addCase(getUserTimeline.pending, (state, action) => {
        setUserTimelineLoadingState(state, {
          userId: action.meta.arg.userId,
          loading: true,
        });
      })
      .addCase(postMessage.pending, (state, action) => {
        timelinesAdapter.updateOne(state, {
          id: action.meta.arg.timelineId,
          changes: {
            messages: [action.meta.arg.messageId],
          },
        });
      })
      .addMatcher(
        isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
        (state, action) => {
          const timeline = action.payload;
          timelinesAdapter.addOne(state, {
            id: timeline.id,
            user: timeline.user,
            messages: timeline.messages.map((m) => m.id),
          });
          setUserTimelineLoadingState(state, {
            userId: timeline.user,
            loading: false,
          });
        }
      );
  },
});

const setUserTimelineLoadingState = (
  state: TimelinesSliceState,
  { userId, loading }: { userId: string; loading: boolean }
) => {
  state.loadingTimelinesByUser[userId] = loading;
};

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
