import { describe, it, beforeEach } from "vitest";
import { TimelinesFixture, createTimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilderProvider } from "@/lib/state-builder";

describe("Feature: Retrieving authenticated user's timeline", () => {
  let fixture: TimelinesFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createTimelinesFixture(testStateBuilderProvider);
  });
  it("Example: Alice is authenticated and can see her timeline", async () => {
    //arrange (given)
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenExistingRemoteTimeline({
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
          text: "Hello it's Bob",
          author: {
            id: "bob-id",
            username: "Bob",
            profilePicture: "bob.png",
            followersCount: 10,
            followingCount: 5,
          },
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });

    //act (when)
    const timelineRetrieving =
      fixture.whenRetrievingAuthenticatedUserTimeline();

    //assert (then)
    fixture.thenTheTimelineOfUserShouldBeLoading("alice-id");
    await timelineRetrieving;
    fixture.thenTheReceivedTimelineShouldBe({
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
          text: "Hello it's Bob",
          author: {
            id: "bob-id",
            username: "Bob",
            profilePicture: "bob.png",
            followersCount: 10,
            followingCount: 5,
          },
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: {
            id: "alice-id",
            username: "Alice",
            profilePicture: "alice.png",
            followersCount: 42,
            followingCount: 20,
          },
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });
  });
});
