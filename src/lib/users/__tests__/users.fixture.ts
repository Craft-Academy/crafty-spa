import { AppStore, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { expect } from "vitest";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { FakeUserGateway } from "../infra/fake-user.gateway";
import { getUserFollowing } from "../usecases/get-following.usecase";
import { User } from "../model/user.entity";
import {
  selectAreFollowersOfLoading,
  selectAreFollowingOfLoading,
} from "../slices/relationships.slice";

export const createUsersFixture = () => {
  let store: AppStore;
  let currentStateBuilder = stateBuilder();
  const userGateway = new FakeUserGateway();
  return {
    givenExistingUsers(users: User[]) {
      currentStateBuilder = currentStateBuilder.withUsers(users);
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
    async whenRetrievingFollowersOf(of: string) {
      store = createTestStore({ userGateway }, currentStateBuilder.build());
      return store.dispatch(getUserFollowers({ userId: of }));
    },
    async whenRetrievingFollowingOf(of: string) {
      store = createTestStore({ userGateway }, currentStateBuilder.build());
      return store.dispatch(getUserFollowing({ userId: of }));
    },
    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowersOfLoading(of, store.getState());

      expect(isLoading).toEqual(true);
    },
    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const isLoading = selectAreFollowingOfLoading(of, store.getState());

      expect(isLoading).toEqual(true);
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
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
