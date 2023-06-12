import { describe, it, expect, vitest } from "vitest";
import { createProfileLayoutViewModel } from "../profile-layout.viewmodel";
import { stateBuilder } from "@/lib/state-builder";
import { buildUser } from "@/lib/users/__tests__/user.builder";
import { AppDispatch, createTestStore } from "@/lib/create-store";
import { Picture } from "@/lib/users/model/picture";
import { uploadProfilePicture } from "@/lib/users/usecases/upload-profile-picture.usecase";

const createTestProfileLayoutViewModel = ({
  userId,
  dispatch = vitest.fn(),
}: {
  userId: string;
  dispatch?: AppDispatch;
}) => createProfileLayoutViewModel({ userId, dispatch });

describe.only("Profile layout view model", () => {
  it("returns the user information", () => {
    const state = stateBuilder()
      .withUsers([
        buildUser({
          id: "alice-id",
          username: "Alice",
          profilePicture: "alice.png",
        }),
      ])
      .build();

    const viewModel = createTestProfileLayoutViewModel({ userId: "alice-id" })(
      state
    );

    expect(viewModel).toMatchObject({
      username: "Alice",
      profilePicture: "alice.png",
    });
  });

  it("indicates that we are on the authenticated user profile", () => {
    {
      const state = stateBuilder()
        .withAuthUser({
          authUser: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
          },
        })
        .build();

      const viewModel = createTestProfileLayoutViewModel({
        userId: "alice-id",
      })(state);

      expect(viewModel.isAuthUserProfile).toBe(true);
    }

    {
      const state = stateBuilder().build();

      const viewModel = createTestProfileLayoutViewModel({
        userId: "alice-id",
      })(state);

      expect(viewModel.isAuthUserProfile).toBe(false);
    }
  });

  it("returns the correct profile links", () => {
    const state = stateBuilder().build();

    const viewModel = createTestProfileLayoutViewModel({ userId: "alice-id" })(
      state
    );

    expect(viewModel).toMatchObject({
      timelineLink: "/u/alice-id",
      followingLink: "/u/alice-id/following",
      followersLink: "/u/alice-id/followers",
    });
  });

  it("returns the correct tabs label", () => {
    const state = stateBuilder()
      .withUsers([
        buildUser({
          id: "alice-id",
          followersCount: 5,
          followingCount: 10,
        }),
      ])
      .build();

    const viewModel = createTestProfileLayoutViewModel({ userId: "alice-id" })(
      state
    );

    expect(viewModel.tabs).toEqual({
      following: "Following (10)",
      followers: "Followers (5)",
    });
  });

  it("should indicate that the picture is loading when on auth user profile and the pictures is indeed loading", () => {
    {
      const state = stateBuilder()
        .withAuthUser({
          authUser: "alice-id",
        })
        .withProfilePictureUploading(undefined)
        .build();

      const viewModel = createTestProfileLayoutViewModel({
        userId: "alice-id",
      })(state);

      expect(viewModel.profilePictureUploading).toBe(true);
    }

    {
      const state = stateBuilder()
        .withAuthUser({
          authUser: "alice-id",
        })
        .withProfilePictureNotUploading(undefined)
        .build();

      const viewModel = createTestProfileLayoutViewModel({
        userId: "alice-id",
      })(state);

      expect(viewModel.profilePictureUploading).toBe(false);
    }

    {
      const state = stateBuilder()
        .withAuthUser({
          authUser: "alice-id",
        })
        .withProfilePictureUploading(undefined)
        .build();

      const viewModel = createTestProfileLayoutViewModel({ userId: "bob-id" })(
        state
      );

      expect(viewModel.profilePictureUploading).toBe(false);
    }
  });

  it("should call the uploadProfilePicture use case on click", async () => {
    const store = createTestStore();
    const viewModel = createTestProfileLayoutViewModel({
      userId: "alice-id",
      dispatch: store.dispatch,
    })(store.getState());
    const picture = {
      name: "alice.png",
    } as Picture;

    await viewModel.onClick(picture);

    expect(store.getDispatchedUseCaseArgs(uploadProfilePicture)).toEqual({
      picture,
    });
  });
});
