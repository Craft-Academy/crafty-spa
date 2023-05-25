import { describe, test, beforeEach } from "vitest";
import { TimelinesFixture, createTimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilderProvider } from "@/lib/state-builder";

describe("Feature: Posting a message on a timeline", () => {
  let fixture: TimelinesFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    fixture = createTimelinesFixture(testStateBuilderProvider);
    authFixture = createAuthFixture(testStateBuilderProvider);
  });
  test("Example: Alice can post a message on her empty timeline", async () => {
    authFixture.givenAuthenticatedUserIs("Alice");
    fixture.givenNowIs(new Date("2023-05-26T10:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [],
    });

    await fixture.whenUserPostsMessage({
      messageId: "msg1-id",
      timelineId: "alice-timeline-id",
      text: "Hello it's Alice",
    });

    fixture.thenMessageShouldHaveBeenPosted({
      id: "msg1-id",
      timelineId: "alice-timeline-id",
      author: "Alice",
      text: "Hello it's Alice",
      publishedAt: "2023-05-26T10:00:00.000Z",
    });
    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
      ],
    });
  });

  test("Example: Alice can post a message on her timeline already containing messages", async () => {
    authFixture.givenAuthenticatedUserIs("Alice");
    fixture.givenNowIs(new Date("2023-05-26T11:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
      ],
    });

    await fixture.whenUserPostsMessage({
      messageId: "msg2-id",
      timelineId: "alice-timeline-id",
      text: "Hello again",
    });

    fixture.thenMessageShouldHaveBeenPosted({
      id: "msg2-id",
      timelineId: "alice-timeline-id",
      author: "Alice",
      text: "Hello again",
      publishedAt: "2023-05-26T11:00:00.000Z",
    });
    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello again",
          author: "Alice",
          publishedAt: "2023-05-26T11:00:00.000Z",
        },
      ],
    });
  });
});
