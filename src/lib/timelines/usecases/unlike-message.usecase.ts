import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";
import { Like } from "../model/like.entity";
import { selectAuthUserId } from "@/lib/auth/reducer";

export type UnlikeMessageParams = {
  likeId: string;
  messageId: string;
};

export const unlikeMessageFailed = createAction<Like>(
  "timelines/unlikeMessageFailed"
);

export const unlikeMessage = createAppAsyncThunk(
  "timelines/unlikeMessage",
  async (
    params: UnlikeMessageParams,
    { extra: { messageGateway }, dispatch, getState }
  ) => {
    try {
      return await messageGateway.unlikeMessage(params.likeId);
    } catch (err) {
      const authUserId = selectAuthUserId(getState());
      dispatch(
        unlikeMessageFailed({
          id: params.likeId,
          messageId: params.messageId,
          userId: authUserId,
        })
      );
    }
  }
);
