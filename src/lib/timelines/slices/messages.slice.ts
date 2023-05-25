import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { messagesAdapter } from "../model/message.entity";
import { RootState } from "@/lib/create-store";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import { postMessagePending } from "../usecases/post-message.usecase";

export const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postMessagePending, (state, action) => {
        messagesAdapter.addOne(state, action.payload);
      })
      .addMatcher(
        isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
        (state, action) => {
          messagesAdapter.addMany(state, action.payload.messages);
        }
      );
  },
});

export const selectMessage = (id: string, state: RootState) =>
  messagesAdapter.getSelectors().selectById(state.timelines.messages, id);

export const selectMessages = (ids: string[], state: RootState) =>
  ids.map((id) => selectMessage(id, state)).filter(Boolean);
