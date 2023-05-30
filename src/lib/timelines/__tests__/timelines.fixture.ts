import { expect } from "vitest";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { AppStore, createTestStore } from "@/lib/create-store";
import { selectIsUserTimelineLoading } from "../slices/timelines.slice";
import { getUserTimeline } from "../usecases/get-user-timeline.usecase";
import {
  PostMessageParams,
  postMessage,
} from "../usecases/post-message.usecase";
import { StubDateProvider } from "../infra/stub-date-provider";
import { FakeMessageGateway } from "../infra/fake-message.gateway";
import { FailingMessageGateway } from "../infra/failing-message.gateway";
import { MessageGateway } from "../model/message.gateway";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { User } from "@/lib/users/model/user.entity";

type ExpectedTimeline = {
  user: User;
  id: string;
  messages: {
    id: string;
    text: string;
    author: User;
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
      user: User;
      id: string;
      messages: {
        id: string;
        text: string;
        author: User;
        publishedAt: string;
      }[];
    }) {
      timelineGateway.timelinesByUser.set(timeline.user.id, timeline);
    },
    givenTimeline(timeline: ExpectedTimeline) {
      testStateBuilderProvider.setState((builder) =>
        builder
          .withTimeline({
            id: timeline.id,
            user: timeline.user.id,
            messages: timeline.messages.map((m) => m.id),
          })
          .withMessages(
            timeline.messages.map((m) => ({
              ...m,
              author: m.author.id,
            }))
          )
          .withUsers([timeline.user, ...timeline.messages.map((m) => m.author)])
          .withNotLoadingTimelineOf({ user: timeline.user.id })
      );
    },
    givenPostMessageWillFailWithError(error: string) {
      messageGateway = new FailingMessageGateway(error);
    },
    givenMessageHasFailedToBePosted({
      messageId,
      error,
    }: {
      messageId: string;
      error: string;
    }) {
      testStateBuilderProvider.setState((builder) =>
        builder.withMessageNotPosted({
          messageId,
          error,
        })
      );
    },
    async whenRetrievingUserTimeline(userId: string) {
      store = createTestStore(
        {
          timelineGateway,
          authGateway,
        },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(getUserTimeline({ userId }));
    },
    async whenRetrievingAuthenticatedUserTimeline() {
      store = createTestStore(
        {
          timelineGateway,
          authGateway,
        },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(getAuthUserTimeline());
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
    thenTheReceivedTimelineShouldBe(expectedTimeline: ExpectedTimeline) {
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
      expectedTimeline: ExpectedTimeline & {
        messageNotPosted?: { messageId: string; error: string };
      }
    ) {
      let expectedState = stateBuilder(testStateBuilderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user.id,
          messages: expectedTimeline.messages.map((m) => m.id),
        })
        .withMessages(
          expectedTimeline.messages.map((m) => ({ ...m, author: m.author.id }))
        )
        .withUsers([
          expectedTimeline.user,
          ...expectedTimeline.messages.map((m) => m.author),
        ])
        .withNotLoadingTimelineOf({ user: expectedTimeline.user.id });

      expectedState =
        expectedTimeline.messageNotPosted === undefined
          ? expectedState.withNoMessagesHavingFailedToBePosted(undefined)
          : expectedState.withMessageNotPosted(
              expectedTimeline.messageNotPosted
            );
      expect(store.getState()).toEqual(expectedState.build());
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
