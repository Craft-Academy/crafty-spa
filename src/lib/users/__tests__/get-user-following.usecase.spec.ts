import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";

describe("Feature: getting the users following", () => {
  let fixture: UsersFixture;

  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving the 10 Bob's following", async () => {
    fixture.givenExistingRemoteFollowing({
      of: "Bob",
      following: [
        "f1-id",
        "f2-id",
        "f3-id",
        "f4-id",
        "f5-id",
        "f6-id",
        "f7-id",
        "f8-id",
        "f9-id",
        "f10-id",
      ],
    });

    const followingRetrieving = fixture.whenRetrievingFollowingOf("Bob");

    fixture.thenFollowingShouldBeLoading({ of: "Bob" });
    await followingRetrieving;
    fixture.thenFollowingShouldBe({
      of: "Bob",
      following: [
        "f1-id",
        "f2-id",
        "f3-id",
        "f4-id",
        "f5-id",
        "f6-id",
        "f7-id",
        "f8-id",
        "f9-id",
        "f10-id",
      ],
    });
  });
});
