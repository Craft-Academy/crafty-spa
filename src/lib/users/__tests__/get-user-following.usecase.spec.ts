import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";

describe("Feature: getting the users following", () => {
  let fixture: UsersFixture;

  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving Bob's following", async () => {
    fixture.givenExistingUsers([
      {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 5,
        followingCount: 10,
      },
    ]);
    fixture.givenExistingRemoteFollowing({
      of: "Bob",
      following: [
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

    const followingRetrieving = fixture.whenRetrievingFollowingOf("Bob");

    fixture.thenFollowingShouldBeLoading({ of: "Bob" });
    await followingRetrieving;
    fixture.thenFollowingShouldBe({
      of: "Bob",
      following: [
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
