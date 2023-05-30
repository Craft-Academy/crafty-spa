import { EntityState, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Message, messagesAdapter } from "../model/message.entity";
import { RootState } from "@/lib/create-store";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import {
  postMessage,
  postMessagePending,
} from "../usecases/post-message.usecase";

export type MessagesSliceState = EntityState<Message> & {
  messagesNotPosted: { [messageId: string]: string };
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState({
    messagesNotPosted: {},
  }) as MessagesSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postMessagePending, (state, action) => {
        messagesAdapter.addOne(state, action.payload);
        delete state.messagesNotPosted[action.payload.id];
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.messagesNotPosted[action.meta.arg.messageId] =
          action.error.message ?? "";
      })
      .addMatcher(
        isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
        (state, action) => {
          messagesAdapter.addMany(
            state,
            action.payload.messages.map((m) => ({ ...m, author: m.author.id }))
          );
        }
      );
  },
});

export const selectMessage = (id: string, state: RootState) =>
  messagesAdapter.getSelectors().selectById(state.timelines.messages, id);

export const selectMessagesOrderedByPublicationDateDesc = (
  ids: string[],
  state: RootState
) => {
  const messages = ids.map((id) => selectMessage(id, state)).filter(Boolean);

  messages.sort(
    (mA, mB) =>
      new Date(mB.publishedAt).getTime() - new Date(mA.publishedAt).getTime()
  );

  return messages;
};

export const selectErrorMessage = (
  id: string,
  state: RootState
): string | undefined => state.timelines.messages.messagesNotPosted[id];
