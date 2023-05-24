import { AppStore, createStore } from "@/lib/create-store";
import { describe, it, expect } from "vitest";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { selectIsUserTimelineLoading } from "../slices/timelines.slice";
import { stateBuilder } from "@/lib/state-builder";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";

describe("Feature: Retrieving user's timeline", () => {
  it("Example: We are on Bob profile", async () => {
    //arrange (given)
    givenExistingTimeline({
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
    const timelineRetrieving = whenRetrievingUserTimeline("Bob");

    //assert (then)
    thenTheTimelineOfUserShouldBeLoading("Bob");
    await timelineRetrieving;
    thenTheReceivedTimelineShouldBe({
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

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
const testStateBuilder = stateBuilder();
let store: AppStore;

function givenExistingTimeline(timeline: {
  user: string;
  id: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  timelineGateway.timelinesByUser.set(timeline.user, timeline);
}

async function whenRetrievingUserTimeline(userId: string) {
  store = createStore(
    {
      timelineGateway,
      authGateway,
    },
    testStateBuilder.build()
  );
  await store.dispatch(getUserTimeline({ userId }));
}

function thenTheTimelineOfUserShouldBeLoading(user: string) {
  const isUserTimelineLoading = selectIsUserTimelineLoading(
    user,
    store.getState()
  );
  expect(isUserTimelineLoading).toBe(true);
}

function thenTheReceivedTimelineShouldBe(expectedTimeline: {
  user: string;
  id: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
}) {
  const expectedState = stateBuilder()
    .withTimeline({
      id: expectedTimeline.id,
      user: expectedTimeline.user,
      messages: expectedTimeline.messages.map((m) => m.id),
    })
    .withMessages(expectedTimeline.messages)
    .withNotLoadingTimelineOf({ user: expectedTimeline.user })
    .build();
  expect(store.getState()).toEqual(expectedState);
}
