import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";

describe("Feature: Retrieving user", () => {
  let fixture: UsersFixture;
  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test("Example: Retrieving Bob profile", async () => {
    fixture.givenExistingRemoteUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
      followersCount: 50,
      followingCount: 10,
    });

    const retrievingUser = fixture.whenRetrievingUser("bob-id");

    fixture.thenUserShouldBeLoading("bob-id");
    await retrievingUser;
    fixture.thenRetrievedUserIs({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
      followersCount: 50,
      followingCount: 10,
    });
  });
});
