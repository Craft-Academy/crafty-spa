import { describe, beforeEach, test } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { buildUser } from "./user.builder";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";

describe("Feature: Following a user", () => {
  let fixture: UsersFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createUsersFixture(testStateBuilderProvider);
  });

  // TODO : Get auth user on user authenticated

  test("Example: Bob follows Alice", async () => {
    const bob = buildUser({ id: "bob-id", followingCount: 0 });
    const alice = buildUser({
      id: "alice-id",
      followersCount: 5,
      isFollowedByAuthUser: false,
    });
    authFixture.givenAuthenticatedUserIs("bob-id");
    fixture.givenExistingUsers([bob, alice]);

    await fixture.whenUserFollows({ followingId: "alice-id" });

    fixture.thenShouldHaveFollowed({ user: "bob-id", followingId: "alice-id" });
    fixture.thenAppStateShouldBe(
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withFollowers({ of: "alice-id", followers: ["bob-id"] })
        .withUsers([
          buildUser({
            ...bob,
            followingCount: 1,
          }),
          buildUser({
            ...alice,
            followersCount: 6,
            isFollowedByAuthUser: true,
          }),
        ])
        .build()
    );
  });
});
