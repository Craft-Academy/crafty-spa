import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { likesAdapter } from "../model/like.entity";
import {
  likeMessage,
  likeMessagePending,
} from "../usecases/like-message.usecase";
import {
  unlikeMessage,
  unlikeMessageFailed,
} from "../usecases/unlike-message.usecase";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import { RootState } from "@/lib/create-store";

export const likesSlice = createSlice({
  name: "likes",
  initialState: likesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(likeMessagePending, (state, action) => {
        likesAdapter.addOne(state, action.payload);
      })
      .addCase(likeMessage.rejected, (state, action) => {
        likesAdapter.removeOne(state, action.meta.arg.likeId);
      })
      .addCase(unlikeMessage.pending, (state, action) => {
        likesAdapter.removeOne(state, action.meta.arg.likeId);
      })
      .addCase(unlikeMessageFailed, (state, action) => {
        likesAdapter.addOne(state, action.payload);
      })
      .addMatcher(
        isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
        (state, action) => {
          likesAdapter.addMany(
            state,
            action.payload.messages.flatMap((m) => m.likes)
          );
        }
      );
  },
});

export const selectLikesByMessage = (messageId: string, state: RootState) => {
  const likes = likesAdapter
    .getSelectors()
    .selectAll(state.timelines.likes)
    .filter((l) => l.messageId === messageId);

  return likes;
};
