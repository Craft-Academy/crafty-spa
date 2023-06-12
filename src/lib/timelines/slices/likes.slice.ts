import { createSlice } from "@reduxjs/toolkit";
import { likesAdapter } from "../model/like.entity";
import {
  likeMessage,
  likeMessagePending,
} from "../usecases/like-message.usecase";

export const likesSlice = createSlice({
  name: "likes",
  initialState: likesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(likeMessagePending, (state, action) => {
      likesAdapter.addOne(state, action.payload);
    });
    builder.addCase(likeMessage.rejected, (state, action) => {
      likesAdapter.removeOne(state, action.meta.arg.likeId);
    });
  },
});
