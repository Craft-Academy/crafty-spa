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
        .build()
    );

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      followers: [
        {
          id: "bob",
          username: "bob",
          profilePicture: "https://picsum.photos/200?random=bob",
          link: "/u/bob",
        },
        {
          id: "alice",
          username: "alice",
          profilePicture: "https://picsum.photos/200?random=alice",
          link: "/u/alice",
        },
      ],
    });
  });
});
