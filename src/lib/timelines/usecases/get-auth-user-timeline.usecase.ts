import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";

export const getAuthUserTimelinePending = createAction<{ authUser: string }>(
  "timelines/getAuthUserTimelinePending"
);

export const getAuthUserTimeline = createAppAsyncThunk(
  "timelines/getAuthUserTimeline",
  async (_, { extra: { authGateway, timelineGateway }, dispatch }) => {
    const authUser = authGateway.getAuthUser();
    dispatch(getAuthUserTimelinePending({ authUser }));

    const { timeline } = await timelineGateway.getUserTimeline({
      userId: authUser,
    });
    return timeline;
  }
);
