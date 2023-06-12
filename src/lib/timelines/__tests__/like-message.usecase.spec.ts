import { describe, test, beforeEach } from "vitest";
import { createTimelinesFixture } from "./timelines.fixture";
import { TimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { buildMessage } from "./message.builder";

describe("Feature: liking a message", () => {
  let authFixture: AuthFixture;
  let fixture: TimelinesFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createTimelinesFixture(testStateBuilderProvider);
  });
  test("Example: Alice likes a message", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenMessage(
      buildMessage({
        id: "m1",
        text: "text message 1",
        author: "bob-id",
        publishedAt: "2023-06-07T17:00:00.000Z",
        likes: [],
      })
    );

    await fixture.whenAuthUserLikesMessage({
      messageId: "m1",
      likeId: "alice-like-id",
    });

    fixture.thenMessageShouldHaveBeenLiked({
      messageId: "m1",
      userId: "alice-id",
      id: "alice-like-id",
    });

    fixture.thenAppStateShouldBe((initialState) =>
      stateBuilder(initialState)
        .withMessages([
          {
            id: "m1",
            text: "text message 1",
            author: "bob-id",
            publishedAt: "2023-06-07T17:00:00.000Z",
            likes: ["alice-like-id"],
          },
        ])
        .withLikes([
          {
            id: "alice-like-id",
            messageId: "m1",
            userId: "alice-id",
          },
        ])
        .build()
    );
  });

  test("Example: Alice likes a message but it fails", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenLike({
      id: "bob-like-id",
      messageId: "m1",
      userId: "bob-id",
    });
    fixture.givenMessage(
      buildMessage({
        id: "m1",
        text: "text message 1",
        author: "bob-id",
        publishedAt: "2023-06-07T17:00:00.000Z",
        likes: ["bob-like-id"],
      })
    );
    fixture.givenLikeMessageWillFail();

    await fixture.whenAuthUserLikesMessage({
      messageId: "m1",
      likeId: "alice-like-id",
    });

    fixture.thenAppStateShouldBe((initialState) =>
      stateBuilder(initialState)
        .withMessages([
          {
            id: "m1",
            text: "text message 1",
            author: "bob-id",
            publishedAt: "2023-06-07T17:00:00.000Z",
            likes: ["bob-like-id"],
          },
        ])
        .build()
    );
  });
});
