import { AppStore, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { expect } from "vitest";
import { getUserFollowers } from "../usecases/get-followers.usecase";
import { FakeUserGateway } from "../infra/fake-user.gateway";
import { getUserFollowing } from "../usecases/get-following.usecase";

export const createUsersFixture = () => {
  let store: AppStore;
  const userGateway = new FakeUserGateway();
  return {
    givenExistingRemoteFollowers({
      of,
      followers,
    }: {
      of: string;
      followers: string[];
    }) {
      userGateway.givenGetUserFollowersResponseFor({ user: of, followers });
    },
    givenExistingRemoteFollowing({
      of,
      following,
    }: {
      of: string;
      following: string[];
    }) {
      userGateway.givenGetUserFollowingResponseFor({ user: of, following });
    },
    async whenRetrievingFollowersOf(of: string) {
      store = createTestStore({ userGateway });
      return store.dispatch(getUserFollowers({ userId: of }));
    },
    async whenRetrievingFollowingOf(of: string) {
      store = createTestStore({ userGateway });
      return store.dispatch(getUserFollowing({ userId: of }));
    },
    thenFollowersShouldBeLoading({ of }: { of: string }) {
      const expectedState = stateBuilder().withFollowersLoading({ of }).build();

      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBeLoading({ of }: { of: string }) {
      const expectedState = stateBuilder().withFollowingLoading({ of }).build();

      expect(expectedState).toEqual(store.getState());
    },
    thenFollowersShouldBe({
      of,
      followers,
    }: {
      of: string;
      followers: string[];
    }) {
      const expectedState = stateBuilder()
        .withFollowers({ of, followers })
        .withFollowersNotLoading({ of })
        .build();

      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBe({
      of,
      following,
    }: {
      of: string;
      following: string[];
    }) {
      const expectedState = stateBuilder()
        .withFollowing({ of, following })
        .withFollowingNotLoading({ of })
        .build();

      expect(expectedState).toEqual(store.getState());
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
