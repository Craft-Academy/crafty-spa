import { expect } from "vitest";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { AppStore, createTestStore } from "@/lib/create-store";
import { selectIsUserTimelineLoading } from "../slices/timelines.slice";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import { selectAuthUser } from "@/lib/auth/reducer";
import {
  PostMessageParams,
  postMessage,
} from "../usecases/post-message.usecase";
import { StubDateProvider } from "../infra/stub-date-provider";
import { FakeMessageGateway } from "../infra/fake-message.gateway";
import { FailingMessageGateway } from "../infra/failing-message.gateway";
import { MessageGateway } from "../model/message.gateway";

type Timeline = {
  user: string;
  id: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
};

export const createTimelinesFixture = (
  testStateBuilderProvider = stateBuilderProvider()
) => {
  const authGateway = new FakeAuthGateway();
  const timelineGateway = new FakeTimelineGateway();
  let messageGateway: MessageGateway = new FakeMessageGateway();
  const dateProvider = new StubDateProvider();
  let store: AppStore;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenExistingRemoteTimeline(timeline: {
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
    givenTimeline(timeline: Timeline) {
      testStateBuilderProvider.setState((builder) =>
        builder
          .withTimeline({
            id: timeline.id,
            user: timeline.user,
            messages: timeline.messages.map((m) => m.id),
          })
          .withMessages(timeline.messages)
          .withNotLoadingTimelineOf({ user: timeline.user })
      );
    },
    givenPostMessageWillFailWithError(error: string) {
      messageGateway = new FailingMessageGateway(error);
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
    async whenUserPostsMessage(postMessageParams: PostMessageParams) {
      store = createTestStore(
        { dateProvider, messageGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(postMessage(postMessageParams));
    },
    thenTheTimelineOfUserShouldBeLoading(user: string) {
      const isUserTimelineLoading = selectIsUserTimelineLoading(
        user,
        store.getState()
      );
      expect(isUserTimelineLoading).toBe(true);
    },
    thenTheReceivedTimelineShouldBe(expectedTimeline: Timeline) {
      this.thenTimelineShouldBe(expectedTimeline);
    },
    thenMessageShouldHaveBeenPosted(expectedPostedMessage: {
      id: string;
      timelineId: string;
      author: string;
      text: string;
      publishedAt: string;
    }) {
      expect((messageGateway as FakeMessageGateway).lastPostedMessage).toEqual(
        expectedPostedMessage
      );
    },
    thenTimelineShouldBe(
      expectedTimeline: Timeline & {
        messageNotPosted?: { messageId: string; error: string };
      }
    ) {
      let expectedState = stateBuilder(testStateBuilderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user,
          messages: expectedTimeline.messages.map((m) => m.id),
        })
        .withMessages(expectedTimeline.messages)
        .withNotLoadingTimelineOf({ user: expectedTimeline.user });

      if (expectedTimeline.messageNotPosted !== undefined) {
        expectedState = expectedState.withMessageNotPosted(
          expectedTimeline.messageNotPosted
        );
      }
      expect(store.getState()).toEqual(expectedState.build());
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
