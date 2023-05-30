import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { usersAdapter } from "../model/user.entity";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { getUserFollowing } from "../usecases/get-following.usecase";
import { RootState } from "@/lib/create-store";
import { getAuthUserTimeline } from "@/lib/timelines/usecases/get-auth-user-timeline.usecase";
import { getUserTimeline } from "@/lib/timelines/usecases/get-user-timeline.usecase";

export const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.followers);
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.following);
      })
      .addMatcher(
        isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
        (state, action) => {
          usersAdapter.upsertMany(state, [
            action.payload.user,
            ...action.payload.messages.map((m) => m.author),
          ]);
        }
      );
  },
});

export const selectUser = (userId: string, rootState: RootState) =>
  usersAdapter.getSelectors().selectById(rootState.users.users, userId);
