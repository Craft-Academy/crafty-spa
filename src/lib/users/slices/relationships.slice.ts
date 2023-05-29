import { EntityState, createSlice } from "@reduxjs/toolkit";
import {
  Relationship,
  relationshipsAdapter,
} from "../model/relationship.entity";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { getUserFollowing } from "../usecases/get-following.usecase";

type RelationshipsSliceState = EntityState<Relationship> & {
  loadingFollowersOf: { [userId: string]: boolean };
  loadingFollowingOf: { [userId: string]: boolean };
};

export const relationshipsSlice = createSlice({
  name: "relationships",
  reducers: {},
  initialState: relationshipsAdapter.getInitialState({
    loadingFollowersOf: {},
    loadingFollowingOf: {},
  }) as RelationshipsSliceState,
  extraReducers(builder) {
    builder
      .addCase(getUserFollowers.pending, (state, action) => {
        state.loadingFollowersOf[action.meta.arg.userId] = true;
      })
      .addCase(getUserFollowing.pending, (state, action) => {
        state.loadingFollowingOf[action.meta.arg.userId] = true;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loadingFollowersOf[action.meta.arg.userId] = false;
        relationshipsAdapter.addMany(
          state,
          action.payload.followers.map((user) => ({
            user: action.meta.arg.userId,
            follows: user.id,
          }))
        );
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.loadingFollowingOf[action.meta.arg.userId] = false;
        relationshipsAdapter.addMany(
          state,
          action.payload.following.map((user) => ({
            user: user.id,
            follows: action.meta.arg.userId,
          }))
        );
      });
  },
});
