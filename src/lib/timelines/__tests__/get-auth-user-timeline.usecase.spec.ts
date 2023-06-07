import { describe, it, beforeEach } from "vitest";
import { TimelinesFixture, createTimelinesFixture } from "./timelines.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilderProvider } from "@/lib/state-builder";
import { buildUser } from "@/lib/users/__tests__/user.builder";
import { buildMessage } from "./message.builder";

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
    const alice = buildUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
    });
    const bobMessage = buildMessage({
      id: "msg1-id",
      text: "Hello it's Bob",
      author: bob.id,
      publishedAt: "2023-05-16T12:06:00.000Z",
    });
    const aliceMessage = buildMessage({
      id: "msg2-id",
      text: "Hello it's Alice",
      author: alice.id,
      publishedAt: "2023-05-16T12:05:00.000Z",
    });
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenExistingRemoteTimeline({
      id: "alice-timeline-id",
      user: alice,
      messages: [
        {
          ...bobMessage,
          author: bob,
        },
        {
          ...aliceMessage,
          author: alice,
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
      user: alice,
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: bob,
          publishedAt: "2023-05-16T12:06:00.000Z",
          likes: [],
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: alice,
          publishedAt: "2023-05-16T12:05:00.000Z",
          likes: [],
        },
      ],
    });
  });
});
