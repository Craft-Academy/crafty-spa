import { describe, test, beforeEach } from "vitest";
import { createTimelinesFixture } from "./timelines.fixture";
import { TimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { buildMessage } from "./message.builder";

describe("Feature: Unliking a message", () => {
  let authFixture: AuthFixture;
  let fixture: TimelinesFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createTimelinesFixture(testStateBuilderProvider);
  });
  test("Example: Alice unlikes a message", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenMessage(
      buildMessage({
        id: "m1",
        text: "text message 1",
        author: "bob-id",
        publishedAt: "2023-06-07T17:00:00.000Z",
        likes: ["alice-like-id", "bob-like-id"],
      })
    );
    fixture.givenLike({
      id: "alice-like-id",
      messageId: "m1",
      userId: "alice-id",
    });
    fixture.givenLike({
      id: "bob-like-id",
      messageId: "m1",
      userId: "bob-id",
    });

    await fixture.whenAuthUserUnlikesMessage({
      messageId: "m1",
      likeId: "alice-like-id",
    });

    fixture.thenMessageShouldHaveBeenUnliked({
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
            likes: ["bob-like-id"],
          },
        ])
        .withOnlyLikes([
          {
            id: "bob-like-id",
            messageId: "m1",
            userId: "bob-id",
          },
        ])
        .build()
    );
  });

  test("Example: Alice unlikes a message but it fails", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenMessage(
      buildMessage({
        id: "m1",
        text: "text message 1",
        author: "bob-id",
        publishedAt: "2023-06-07T17:00:00.000Z",
        likes: ["alice-like-id", "bob-like-id"],
      })
    );
    fixture.givenLike({
      id: "bob-like-id",
      messageId: "m1",
      userId: "bob-id",
    });
    fixture.givenLike({
      id: "alice-like-id",
      messageId: "m1",
      userId: "alice-id",
    });
    fixture.givenUnlikeMessageWillFail();

    await fixture.whenAuthUserUnlikesMessage({
      messageId: "m1",
      likeId: "alice-like-id",
    });

    fixture.thenAppStateShouldBe((initialState) => initialState);
  });
});
