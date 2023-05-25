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
      user: "Bob",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });

    //act (when)
    const timelineRetrieving = fixture.whenRetrievingUserTimeline("Bob");

    //assert (then)
    fixture.thenTheTimelineOfUserShouldBeLoading("Bob");
    await timelineRetrieving;
    fixture.thenTheReceivedTimelineShouldBe({
      id: "bob-timeline-id",
      user: "Bob",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });
  });
});
