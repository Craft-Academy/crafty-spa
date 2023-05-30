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
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenNowIs(new Date("2023-05-26T10:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
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
      author: "alice-id",
      text: "Hello it's Alice",
      publishedAt: "2023-05-26T10:00:00.000Z",
    });
    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
      ],
    });
  });

  test("Example: Alice can post a message on her timeline already containing messages", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenNowIs(new Date("2023-05-26T11:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
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
      author: "alice-id",
      text: "Hello again",
      publishedAt: "2023-05-26T11:00:00.000Z",
    });
    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello again",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-26T11:00:00.000Z",
        },
      ],
    });
  });

  test("Example: Alice tries to post a message but it has failed", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenNowIs(new Date("2023-05-26T10:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [],
    });
    fixture.givenPostMessageWillFailWithError("Cannot post message");

    await fixture.whenUserPostsMessage({
      messageId: "msg1-id",
      timelineId: "alice-timeline-id",
      text: "Hello it's Alice",
    });

    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
      ],
      messageNotPosted: { messageId: "msg1-id", error: "Cannot post message" },
    });
  });

  test("Example: Alice successfully retries to post a message", async () => {
    authFixture.givenAuthenticatedUserIs("Alice");
    fixture.givenNowIs(new Date("2023-05-26T10:00:00.000Z"));
    fixture.givenTimeline({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          text: "Hello it's Alice",
          publishedAt: "2023-05-26T09:59:00.000Z",
        },
      ],
    });
    fixture.givenMessageHasFailedToBePosted({
      messageId: "msg1-id",
      error: "Cannot post message",
    });
    await fixture.whenUserPostsMessage({
      messageId: "msg1-id",
      timelineId: "alice-timeline-id",
      text: "Hello it's Alice",
    });

    fixture.thenTimelineShouldBe({
      id: "alice-timeline-id",
      user: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
        followersCount: 42,
        followingCount: 20,
      },
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-26T10:00:00.000Z",
        },
      ],
      messageNotPosted: undefined,
    });
  });
});
