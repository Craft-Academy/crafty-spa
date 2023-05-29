import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";

describe("Feature: getting the users followers", () => {
  let fixture: UsersFixture;

  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving the 10 Bob's followers", async () => {
    fixture.givenExistingRemoteFollowers({
      of: "Bob",
      followers: [
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

    const followersRetrieving = fixture.whenRetrievingFollowersOf("Bob");

    fixture.thenFollowersShouldBeLoading({ of: "Bob" });
    await followersRetrieving;
    fixture.thenFollowersShouldBe({
      of: "Bob",
      followers: [
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
