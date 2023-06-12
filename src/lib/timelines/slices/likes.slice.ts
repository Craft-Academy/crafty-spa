import { createSlice } from "@reduxjs/toolkit";
import { likesAdapter } from "../model/like.entity";
import {
  likeMessage,
  likeMessagePending,
} from "../usecases/like-message.usecase";
import {
  unlikeMessage,
  unlikeMessageFailed,
} from "../usecases/unlike-message.usecase";

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
      });
  },
});
