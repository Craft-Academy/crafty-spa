import { describe, test, expect } from "vitest";
import {
  ProfileFollowersViewModelType,
  createProfileFollowersViewModel,
} from "../profile-followers.viewmodel";
import { stateBuilder } from "@/lib/state-builder";
import { buildUser } from "@/lib/users/__tests__/user.builder";

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
    const alice = buildUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
      followersCount: 15,
      isFollowedByAuthUser: true,
    });
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
      followersCount: 10,
      isFollowedByAuthUser: false,
    });
    const profileFollowersViewModel = createProfileFollowersViewModel({
      of: "Charles",
    })(
      stateBuilder()
        .withFollowers({ of: "Charles", followers: ["bob-id", "alice-id"] })
        .withUsers([bob, alice])
        .build()
    );

    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: [
        {
          id: "bob-id",
          username: "Bob",
          profilePicture: "bob.png",
          followersCount: 10,
          isFollowedByAuthUser: false,
          link: "/u/bob-id",
        },
        {
          id: "alice-id",
          username: "Alice",
          profilePicture: "alice.png",
          followersCount: 15,
          isFollowedByAuthUser: true,
          link: "/u/alice-id",
        },
      ],
    });
  });
});
