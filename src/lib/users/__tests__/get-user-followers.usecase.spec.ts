import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";

describe("Feature: getting the users followers", () => {
  let fixture: UsersFixture;

  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving the Bob's followers", async () => {
    fixture.givenExistingUsers([
      {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 5,
        followingCount: 10,
      },
    ]);
    fixture.givenExistingRemoteFollowers({
      of: "Bob",
      followers: [
        {
          id: "alice-id",
          username: "_Alice_",
          profilePicture: "alice-2.png",
          followersCount: 10,
          followingCount: 20,
        },
        {
          id: "charles-id",
          username: "Charles",
          profilePicture: "charles.png",
          followersCount: 3,
          followingCount: 5,
        },
      ],
    });

    const followersRetrieving = fixture.whenRetrievingFollowersOf("Bob");

    fixture.thenFollowersShouldBeLoading({ of: "Bob" });
    await followersRetrieving;
    fixture.thenFollowersShouldBe({
      of: "Bob",
      followers: [
        {
          id: "alice-id",
          username: "_Alice_",
          profilePicture: "alice-2.png",
          followersCount: 10,
          followingCount: 20,
        },
        {
          id: "charles-id",
          username: "Charles",
          profilePicture: "charles.png",
          followersCount: 3,
          followingCount: 5,
        },
      ],
    });
  });
});
