import { describe, test, expect } from "vitest";
import {
  ProfileFollowingViewModelType,
  createProfileFollowingViewModel,
} from "../profile-following.viewmodel";
import { stateBuilder } from "@/lib/state-builder";
import { buildUser } from "@/lib/users/__tests__/user.builder";

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
    const alice = buildUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
      followersCount: 15,
    });
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
      followersCount: 10,
    });
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: "Charles",
    })(
      stateBuilder()
        .withFollowing({ of: "Charles", following: ["bob-id", "alice-id"] })
        .withUsers([bob, alice])
        .build()
    );

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: [
        {
          id: "bob-id",
          username: "Bob",
          profilePicture: "bob.png",
          followersCount: 10,
          link: "/u/bob-id",
        },
        {
          id: "alice-id",
          username: "Alice",
          profilePicture: "alice.png",
          followersCount: 15,
          link: "/u/alice-id",
        },
      ],
    });
  });
});
