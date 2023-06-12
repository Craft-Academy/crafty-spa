import { EntityState, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User, usersAdapter } from "../model/user.entity";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { getUserFollowing } from "../usecases/get-following.usecase";
import { RootState } from "@/lib/create-store";
import { getAuthUserTimeline } from "@/lib/timelines/usecases/get-auth-user-timeline.usecase";
import { getUserTimeline } from "@/lib/timelines/usecases/get-user-timeline.usecase";
import { getUser } from "../usecases/get-user.usecase";
import { followUserPending } from "../usecases/follow-user.usecase";
import { unfollowUserPending } from "../usecases/unfollow-user.usecase";
import {
  profilePictureUploading,
  uploadProfilePicture,
} from "../usecases/upload-profile-picture.usecase";

export type UsersSliceState = EntityState<User> & {
  loadingUsers: { [userId: string]: boolean };
  profilePictureUploading: boolean;
};

export const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({
    loadingUsers: {},
    profilePictureUploading: false,
  }) as UsersSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.followers);
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.following);
      })
      .addCase(getUser.pending, (state, action) => {
        state.loadingUsers[action.meta.arg.userId] = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        usersAdapter.upsertOne(state, action.payload);
        state.loadingUsers[action.payload.id] = false;
      })
      .addCase(followUserPending, (state, action) => {
        const user = usersAdapter
          .getSelectors()
          .selectById(state, action.payload.userId);
        const userFollowed = usersAdapter
          .getSelectors()
          .selectById(state, action.payload.followingId);

        if (!user || !userFollowed) return;
        usersAdapter.updateMany(state, [
          {
            id: action.payload.userId,
            changes: {
              followingCount: user.followingCount + 1,
            },
          },
          {
            id: userFollowed.id,
            changes: {
              followersCount: userFollowed.followersCount + 1,
              isFollowedByAuthUser: true,
            },
          },
        ]);
      })
      .addCase(unfollowUserPending, (state, action) => {
        const user = usersAdapter
          .getSelectors()
          .selectById(state, action.payload.userId);
        const userFollowed = usersAdapter
          .getSelectors()
          .selectById(state, action.payload.followingId);

        if (!user || !userFollowed) return;
        usersAdapter.updateMany(state, [
          {
            id: action.payload.userId,
            changes: {
              followingCount: user.followingCount - 1,
            },
          },
          {
            id: userFollowed.id,
            changes: {
              followersCount: userFollowed.followersCount - 1,
              isFollowedByAuthUser: false,
            },
          },
        ]);
      })
      .addCase(profilePictureUploading, (state, action) => {
        state.profilePictureUploading = true;
        usersAdapter.updateOne(state, {
          id: action.payload.authUserId,
          changes: {
            profilePicture: action.payload.preview,
          },
        });
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profilePictureUploading = false;
        usersAdapter.updateOne(state, {
          id: action.payload.userId,
          changes: {
            profilePicture: action.payload.profilePictureUrl,
          },
        });
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

export const selectIsUserLoading = (userId: string, rootState: RootState) =>
  rootState.users.users.loadingUsers[userId] ?? false;

export const selectIsProfilePictureUploading = (rootState: RootState) =>
  rootState.users.users.profilePictureUploading;
