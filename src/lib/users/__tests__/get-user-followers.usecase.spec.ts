import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";
import { buildUser } from "./user.builder";

describe("Feature: getting the users followers", () => {
  let fixture: UsersFixture;

  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving the Bob's followers", async () => {
    fixture.givenExistingUsers([
      buildUser({
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 5,
        followingCount: 10,
      }),
    ]);
    fixture.givenExistingRemoteFollowers({
      of: "Bob",
      followers: [
        buildUser({
          id: "alice-id",
          username: "_Alice_",
          profilePicture: "alice-2.png",
          followersCount: 10,
          followingCount: 20,
        }),
        buildUser({
          id: "charles-id",
          username: "Charles",
          profilePicture: "charles.png",
          followersCount: 3,
          followingCount: 5,
        }),
      ],
    });

    const followersRetrieving = fixture.whenRetrievingFollowersOf("Bob");

    fixture.thenFollowersShouldBeLoading({ of: "Bob" });
    await followersRetrieving;
    fixture.thenFollowersShouldBe({
      of: "Bob",
      followers: [
        buildUser({
          id: "alice-id",
          username: "_Alice_",
          profilePicture: "alice-2.png",
          followersCount: 10,
          followingCount: 20,
        }),
        buildUser({
          id: "charles-id",
          username: "Charles",
          profilePicture: "charles.png",
          followersCount: 3,
          followingCount: 5,
        }),
      ],
    });
  });
});
