import { describe, test, expect } from "vitest";
import {
  ProfileFollowersViewModelType,
  createProfileFollowersViewModel,
} from "../profile-followers.viewmodel";
import { stateBuilder } from "@/lib/state-builder";

describe("ProfileFollowers view model", () => {
  test("Example: Charles followers are loading", () => {
    const profileFollowersViewModel = createProfileFollowersViewModel({
      of: "Charles",
    })(stateBuilder().withFollowersLoading({ of: "Charles" }).build());

    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoading,
    });
  });

  test("Example: Charles followers are loaded", () => {
    const profileFollowersViewModel = createProfileFollowersViewModel({
      of: "Charles",
    })(
      stateBuilder()
        .withFollowers({ of: "Charles", followers: ["bob", "alice"] })
        .withUsers([
          {
            id: "bob",
            username: "Bob",
            profilePicture: "bob.png",
            followersCount: 10,
            followingCount: 12,
          },
          {
            id: "alice",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 15,
            followingCount: 5,
          },
        ])
        .build()
    );

    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: [
        {
          id: "bob",
          username: "Bob",
          profilePicture: "bob.png",
          followersCount: 10,
          link: "/u/bob",
        },
        {
          id: "alice",
          username: "Alice",
          profilePicture: "alice.png",
          followersCount: 15,
          link: "/u/alice",
        },
      ],
    });
  });
});
