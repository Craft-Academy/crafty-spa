import { describe, beforeEach, test } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { buildUser } from "./user.builder";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";

describe("Feature: Unfollowing a user", () => {
  let fixture: UsersFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createUsersFixture(testStateBuilderProvider);
  });
  test("Example: Bob unfollows Alice", async () => {
    const bob = buildUser({ id: "bob-id", followingCount: 1 });
    const alice = buildUser({
      id: "alice-id",
      followersCount: 5,
      isFollowedByAuthUser: true,
    });
    authFixture.givenAuthenticatedUserIs("bob-id");
    fixture.givenUserFollows({ user: "bob-id", followingId: "alice-id" });
    fixture.givenExistingUsers([bob, alice]);

    await fixture.whenUserUnfollows({ followingId: "alice-id" });

    fixture.thenShouldHaveUnfollowed({
      user: "bob-id",
      followingId: "alice-id",
    });
    fixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withFollowers({ of: "alice-id", followers: [] })
        .withUsers([
          buildUser({
            ...bob,
            followingCount: 0,
          }),
          buildUser({
            ...alice,
            followersCount: 4,
            isFollowedByAuthUser: false,
          }),
        ])
        .build()
    );
  });

  test("Example: Bob and Alice follow each other, then Bob decides to unfollow Alice", async () => {
    const bob = buildUser({
      id: "bob-id",
      followersCount: 1,
      followingCount: 1,
    });
    const alice = buildUser({
      id: "alice-id",
      followersCount: 1,
      followingCount: 1,
      isFollowedByAuthUser: true,
    });
    authFixture.givenAuthenticatedUserIs("bob-id");
    fixture.givenUserFollows({ user: "bob-id", followingId: "alice-id" });
    fixture.givenUserFollows({ user: "alice-id", followingId: "bob-id" });
    fixture.givenExistingUsers([bob, alice]);

    await fixture.whenUserUnfollows({ followingId: "alice-id" });

    fixture.thenShouldHaveUnfollowed({
      user: "bob-id",
      followingId: "alice-id",
    });
    fixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withFollowers({ of: "alice-id", followers: [] })
        .withFollowers({ of: "bob-id", followers: ["alice-id"] })
        .withUsers([
          buildUser({
            ...bob,
            followersCount: 1,
            followingCount: 0,
          }),
          buildUser({
            ...alice,
            followersCount: 0,
            followingCount: 1,
            isFollowedByAuthUser: false,
          }),
        ])
        .build()
    );
  });
});
