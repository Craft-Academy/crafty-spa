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
        .build()
    );

    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
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
