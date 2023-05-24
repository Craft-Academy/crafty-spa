import { expect } from "vitest";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { AppStore, createTestStore } from "@/lib/create-store";
import { selectIsUserTimelineLoading } from "../slices/timelines.slice";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import { selectAuthUser } from "@/lib/auth/reducer";

export const createTimelinesFixture = (
  testStateBuilderProvider = stateBuilderProvider()
) => {
  const authGateway = new FakeAuthGateway();
  const timelineGateway = new FakeTimelineGateway();
  let store: AppStore;

  return {
    givenExistingTimeline(timeline: {
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
    },
    async whenRetrievingUserTimeline(userId: string) {
      store = createTestStore(
        {
          timelineGateway,
          authGateway,
        },
        testStateBuilderProvider.getState()
      );
      await store.dispatch(getUserTimeline({ userId }));
    },
    async whenRetrievingAuthenticatedUserTimeline() {
      const authUserId = selectAuthUser(testStateBuilderProvider.getState());
      return this.whenRetrievingUserTimeline(authUserId);
    },
    thenTheTimelineOfUserShouldBeLoading(user: string) {
      const isUserTimelineLoading = selectIsUserTimelineLoading(
        user,
        store.getState()
      );
      expect(isUserTimelineLoading).toBe(true);
    },
    thenTheReceivedTimelineShouldBe(expectedTimeline: {
      user: string;
      id: string;
      messages: {
        id: string;
        text: string;
        author: string;
        publishedAt: string;
      }[];
    }) {
      const expectedState = stateBuilder(testStateBuilderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user,
          messages: expectedTimeline.messages.map((m) => m.id),
        })
        .withMessages(expectedTimeline.messages)
        .withNotLoadingTimelineOf({ user: expectedTimeline.user })
        .build();
      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
