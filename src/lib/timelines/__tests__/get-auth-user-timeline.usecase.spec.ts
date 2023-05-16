import { createStore } from "@/lib/create-store";
import { describe, it, expect } from "vitest";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";

describe("Feature: Retrieving authenticated user's timeline", () => {
  it("Example: Alice is authenticated and can see her timeline", async () => {
    //arrange (given)
    givenAuthenticatedUserIs("Alice");
    givenExistingTimeline({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });

    //act (when)
    await whenRetrievingAuthenticatedUserTimeline();

    //assert (then)
    thenTheReceivedTimelineShouldBe({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });
  });
});

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
const store = createStore({
  authGateway,
  timelineGateway,
});

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user;
}

function givenExistingTimeline(timeline: {
  user: string;
  messages: {
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  timelineGateway.timelinesByUser.set("Alice", timeline);
}

async function whenRetrievingAuthenticatedUserTimeline() {
  await store.dispatch(getAuthUserTimeline());
}

function thenTheReceivedTimelineShouldBe(expectedTimeline: {
  user: string;
  messages: {
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  const authUserTimeline = store.getState();
  expect(authUserTimeline).toEqual(expectedTimeline);
}
