import { describe, test, expect } from "vitest";
import {
  ProfileFollowingViewModelType,
  createProfileFollowingViewModel,
} from "../profile-following.viewmodel";
import { stateBuilder } from "@/lib/state-builder";

describe("ProfileFollowing view model", () => {
  test("Example: Charles following are loading", () => {
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: "Charles",
    })(stateBuilder().withFollowingLoading({ of: "Charles" }).build());

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoading,
    });
  });

  test("Example: Charles following are loaded", () => {
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: "Charles",
    })(
      stateBuilder()
        .withFollowing({ of: "Charles", following: ["bob", "alice"] })
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

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: [
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
