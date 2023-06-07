import { describe, test, beforeEach } from "vitest";
import { createTimelinesFixture } from "./timelines.fixture";
import { TimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilderProvider } from "@/lib/state-builder";
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
    });
    fixture.thenMessageShouldBe({
      id: "m1",
      text: "text message 1",
      author: "bob-id",
      publishedAt: "2023-06-07T17:00:00.000Z",
      likes: ["alice-like-id"],
    });
  });
});
