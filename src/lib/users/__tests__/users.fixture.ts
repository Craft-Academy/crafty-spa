import { AppStore, RootState, createTestStore } from "@/lib/create-store";
import {
  StateBuilderProvider,
  stateBuilder,
  stateBuilderProvider,
} from "@/lib/state-builder";
import { expect } from "vitest";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { FakeUserGateway } from "../infra/fake-user.gateway";
import { getUserFollowing } from "../usecases/get-following.usecase";
import { User } from "../model/user.entity";
import {
  selectAreFollowersOfLoading,
  selectAreFollowingOfLoading,
} from "../slices/relationships.slice";
import {
  selectIsProfilePictureUploading,
  selectIsUserLoading,
} from "../slices/users.slice";
import { getUser } from "../usecases/get-user.usecase";
import { followUser } from "../usecases/follow-user.usecase";
import { unfollowUser } from "../usecases/unfollow-user.usecase";
import { Picture } from "../model/picture";
import { uploadProfilePicture } from "../usecases/upload-profile-picture.usecase";

export const createUsersFixture = (
  testStateBuilderProvider: StateBuilderProvider = stateBuilderProvider()
) => {
  let store: AppStore;
  const userGateway = new FakeUserGateway();
  return {
    givenExistingUsers(users: User[]) {
      testStateBuilderProvider.setState((builder) => builder.withUsers(users));
    },
    givenProfilePicturePreviewUrlWillBe({
      picture,
      previewUrl,
    }: {
      picture: Picture;
      previewUrl: string;
    }) {
      userGateway.previewUrlByPicture = new Map([[picture, previewUrl]]);
    },
    givenUploadedPictureUrlWillBe(uploadedPictureUrl: string) {
      userGateway.uploadedPictureUrl = uploadedPictureUrl;
    },
    givenUserFollows({
      user,
      followingId,
    }: {
      user: string;
      followingId: string;
    }) {
      testStateBuilderProvider.setState((builder) =>
        builder.withFollowing({ of: user, following: [followingId] })
      );
    },
    givenExistingRemoteUser(user: User) {
      userGateway.users.set(user.id, user);
    },
    givenExistingRemoteFollowers({
      of,
      followers,
    }: {
      of: string;
      followers: User[];
    }) {
      userGateway.givenGetUserFollowersResponseFor({ user: of, followers });
    },
    givenExistingRemoteFollowing({
      of,
      following,
    }: {
      of: string;
      following: User[];
    }) {
      userGateway.givenGetUserFollowingResponseFor({ user: of, following });
    },
    async whenRetrievingUser(userId: string) {
      store = createTestStore({ userGateway });

      return store.dispatch(getUser({ userId }));
    },
    async whenRetrievingFollowersOf(of: string) {
      store = createTestStore(
        { userGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(getUserFollowers({ userId: of }));
    },
    async whenRetrievingFollowingOf(of: string) {
      store = createTestStore(
        { userGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(getUserFollowing({ userId: of }));
    },
    async whenUserFollows({ followingId }: { followingId: string }) {
      store = createTestStore(
        { userGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(followUser({ followingId }));
    },
    async whenUserUnfollows({ followingId }: { followingId: string }) {
      store = createTestStore(
        { userGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(unfollowUser({ followingId }));
    },
    async whenUploadingProfilePicture(picture: Picture) {
      store = createTestStore(
        { userGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(uploadProfilePicture({ picture }));
    },
    thenUserShouldBeLoading(userId: string) {
      const isLoading = selectIsUserLoading(userId, store.getState());

      expect(isLoading).toBe(true);
    },
    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowersOfLoading(of, store.getState());

      expect(isLoading).toEqual(true);
    },
    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowingOfLoading(of, store.getState());

      expect(isLoading).toEqual(true);
    },
    thenRetrievedUserIs(expectedUser: User) {
      const expectedState = stateBuilder()
        .withUsers([expectedUser])
        .withNotLoadingUser({ userId: expectedUser.id })
        .build();

      expect(expectedState).toEqual(store.getState());
    },
    thenFollowersShouldBe({
      of,
      followers,
    }: {
      of: string;
      followers: User[];
    }) {
      const expectedState = stateBuilder()
        .withFollowers({ of, followers: followers.map((f) => f.id) })
        .withFollowersNotLoading({ of })
        .withUsers(followers)
        .build();

      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBe({
      of,
      following,
    }: {
      of: string;
      following: User[];
    }) {
      const expectedState = stateBuilder()
        .withFollowing({ of, following: following.map((f) => f.id) })
        .withUsers(following)
        .withFollowingNotLoading({ of })
        .build();

      expect(expectedState).toEqual(store.getState());
    },
    thenShouldHaveFollowed({
      user,
      followingId,
    }: {
      user: string;
      followingId: string;
    }) {
      expect(userGateway.lastFollowedUserBy).toEqual({ user, followingId });
    },
    thenShouldHaveUnfollowed({
      user,
      followingId,
    }: {
      user: string;
      followingId: string;
    }) {
      expect(userGateway.lastUnfollowedUserBy).toEqual({ user, followingId });
    },
    thenAppStateShouldBe(expectedState: RootState) {
      expect(expectedState).toEqual(store.getState());
    },
    thenProfilePictureShouldHaveBeenUploaded({
      userId,
      picture,
    }: {
      userId: string;
      picture: Picture;
    }) {
      expect(userGateway.uploadedPictureByUser.get(userId)).toBe(picture);
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
