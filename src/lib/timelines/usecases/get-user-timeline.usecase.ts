import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";

export const getUserTimelinePending = createAction<{ authUser: string }>(
  "timelines/getUserTimelinePending"
);

export const getUserTimeline = createAppAsyncThunk(
  "timelines/getUserTimeline",
  async (params: { userId: string }, { extra: { timelineGateway } }) => {
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: params.userId,
    });
    return timeline;
  }
  // {
  //   condition(_, { getState }) {
  //     const authUser = selectAuthUser(getState());
  //     const isTimelineLoading = selectIsUserTimelineLoading(
  //       authUser,
  //       getState()
  //     );
  //     return !isTimelineLoading;
  //   },
  // }
);
