import { selectAuthUserId } from "@/lib/auth/reducer";
import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";
import { Like } from "../model/like.entity";

export type LikeMessageParams = {
  likeId: string;
  messageId: string;
};

export const likeMessagePending = createAction<Like>(
  "timelines/likeMessagePending"
);

export const likeMessage = createAppAsyncThunk(
  "timelines/likeMessage",
  async (
    params: LikeMessageParams,
    { extra: { messageGateway }, getState, dispatch }
  ) => {
    const authUserId = selectAuthUserId(getState());
    const like: Like = {
      userId: authUserId,
      id: params.likeId,
      messageId: params.messageId,
    };
    dispatch(likeMessagePending(like));

    return messageGateway.likeMessage(like);
  }
);
