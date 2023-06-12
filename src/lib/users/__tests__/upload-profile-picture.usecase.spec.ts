import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { describe, test, beforeEach } from "vitest";
import { UsersFixture, createUsersFixture } from "./users.fixture";
import {
  StateBuilderProvider,
  stateBuilder,
  stateBuilderProvider,
} from "@/lib/state-builder";
import { buildUser } from "./user.builder";
import { Picture } from "../model/picture";

describe("Feature: uploading a new profile picture", () => {
  let authFixture: AuthFixture;
  let fixture: UsersFixture;
  let testStateBuilderProvider: StateBuilderProvider;
  beforeEach(() => {
    testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createUsersFixture(testStateBuilderProvider);
  });
  test("Example: Alice upload a new profile picture", async () => {
    const alice = buildUser({
      id: "alice-id",
      profilePicture: "alice.png",
    });
    const alice2png = {
      name: "alice2.png",
    } as Picture;
    authFixture.givenAuthenticatedUserIs({
      id: alice.id,
      username: alice.username,
      profilePicture: alice.profilePicture,
    });
    fixture.givenExistingUsers([alice]);
    fixture.givenProfilePicturePreviewUrlWillBe({
      picture: alice2png,
      previewUrl: "alice2-preview.png",
    });
    fixture.givenUploadedPictureUrlWillBe("http://picture.com/alice2.png");

    const uploadingPicture = fixture.whenUploadingProfilePicture(alice2png);

    fixture.thenAppStateShouldBe(
      stateBuilder(testStateBuilderProvider.getState())
        .withProfilePictureUploading(undefined)
        .withUsers([
          {
            ...alice,
            profilePicture: "alice2-preview.png",
          },
        ])
        .withAuthUser({
          authUser: {
            id: alice.id,
            username: alice.username,
            profilePicture: "alice2-preview.png",
          },
        })
        .build()
    );
    await uploadingPicture;
    fixture.thenProfilePictureShouldHaveBeenUploaded({
      userId: alice.id,
      picture: alice2png,
    });
    fixture.thenAppStateShouldBe(
      stateBuilder(testStateBuilderProvider.getState())
        .withUsers([
          {
            ...alice,
            profilePicture: "http://picture.com/alice2.png",
          },
        ])
        .withAuthUser({
          authUser: {
            id: alice.id,
            username: alice.username,
            profilePicture: "http://picture.com/alice2.png",
          },
        })
        .build()
    );
  });
});
