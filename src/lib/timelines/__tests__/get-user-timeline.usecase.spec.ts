import { describe, it, beforeEach } from "vitest";
import { TimelinesFixture, createTimelinesFixture } from "./timelines.fixture";

describe("Feature: Retrieving user's timeline", () => {
  let fixture: TimelinesFixture;

  beforeEach(() => {
    fixture = createTimelinesFixture();
  });

  it("Example: We are on Bob profile", async () => {
    //arrange (given)
    fixture.givenExistingRemoteTimeline({
      id: "bob-timeline-id",
      user: {
        id: "bob-id",
        username: "Bob",
        profilePicture: "bob.png",
        followersCount: 10,
        followingCount: 5,
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
    const timelineRetrieving = fixture.whenRetrievingUserTimeline("bob-id");

    //assert (then)
    fixture.thenTheTimelineOfUserShouldBeLoading("bob-id");
    await timelineRetrieving;
    fixture.thenTheReceivedTimelineShouldBe({
      id: "bob-timeline-id",
      user: {
        id: "bob-id",
        username: "Bob",
        profilePicture: "bob.png",
        followersCount: 10,
        followingCount: 5,
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
