import { EntityState, createSlice } from "@reduxjs/toolkit";
import {
  Relationship,
  relationshipsAdapter,
} from "../model/relationship.entity";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { getUserFollowing } from "../usecases/get-following.usecase";
import { RootState } from "@/lib/create-store";
import { followUserPending } from "../usecases/follow-user.usecase";
import { unfollowUserPending } from "../usecases/unfollow-user.usecase";

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
            user: user.id,
            follows: action.meta.arg.userId,
          }))
        );
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.loadingFollowingOf[action.meta.arg.userId] = false;
        relationshipsAdapter.addMany(
          state,
          action.payload.following.map((user) => ({
            user: action.meta.arg.userId,
            follows: user.id,
          }))
        );
      })
      .addCase(followUserPending, (state, action) => {
        relationshipsAdapter.addOne(state, {
          user: action.payload.userId,
          follows: action.payload.followingId,
        });
      })
      .addCase(unfollowUserPending, (state, action) => {
        const relationshipId = relationshipsAdapter.selectId({
          user: action.payload.userId,
          follows: action.payload.followingId,
        });
        relationshipsAdapter.removeOne(state, relationshipId);
      });
  },
});

export const selectAreFollowersOfLoading = (of: string, rootState: RootState) =>
  rootState.users.relationships.loadingFollowersOf[of] ?? false;

export const selectAreFollowingOfLoading = (of: string, rootState: RootState) =>
  rootState.users.relationships.loadingFollowingOf[of] ?? false;

export const selectFollowersOf = (of: string, rootState: RootState) => {
  return relationshipsAdapter
    .getSelectors()
    .selectAll(rootState.users.relationships)
    .filter((relationship) => relationship.follows === of)
    .map((followers) => followers.user);
};

export const selectFollowingOf = (of: string, rootState: RootState) => {
  return relationshipsAdapter
    .getSelectors()
    .selectAll(rootState.users.relationships)
    .filter((relationship) => relationship.user === of)
    .map((following) => following.follows);
};
