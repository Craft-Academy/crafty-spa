import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { Message } from "../model/message.entity";
import { createAction } from "@reduxjs/toolkit";
import { selectAuthUser } from "@/lib/auth/reducer";

export type PostMessageParams = {
  messageId: string;
  timelineId: string;
  text: string;
};

export const postMessagePending = createAction<Message>(
  "timelines/postMessagePending"
);

export const postMessage = createAppAsyncThunk(
  "timelines/postMessage",
  (
    params: PostMessageParams,
    { extra: { dateProvider, messageGateway }, dispatch, getState }
  ) => {
    const authUser = selectAuthUser(getState());
    const message: Message = {
      id: params.messageId,
      text: params.text,
      author: authUser,
      publishedAt: dateProvider.getNow().toISOString(),
    };
    dispatch(postMessagePending(message));

    return messageGateway.postMessage({
      id: message.id,
      text: message.text,
      author: message.author,
      publishedAt: message.publishedAt,
      timelineId: params.timelineId,
    });
  }
);
