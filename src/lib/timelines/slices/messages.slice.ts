import { createSlice } from "@reduxjs/toolkit";
import { messagesAdapter } from "../model/message.entity";
import { RootState } from "@/lib/create-store";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";

export const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      messagesAdapter.addMany(state, action.payload.messages);
    });
  },
});

export const selectMessage = (id: string, state: RootState) =>
  messagesAdapter.getSelectors().selectById(state.messages, id);

export const selectMessages = (ids: string[], state: RootState) =>
  ids.map((id) => selectMessage(id, state)).filter(Boolean);
