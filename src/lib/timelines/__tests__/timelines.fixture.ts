import { expect } from "vitest";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { AppStore, RootState, createTestStore } from "@/lib/create-store";
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
import { Message } from "../model/message.entity";
import { likeMessage } from "../usecases/like-message.usecase";
import { Like } from "../model/like.entity";
import { unlikeMessage } from "../usecases/unlike-message.usecase";

type ExpectedTimeline = {
  user: User;
  id: string;
  messages: {
    id: string;
    text: string;
    author: User;
    publishedAt: string;
    likes: Like[];
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
        likes: Like[];
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
              likes: m.likes.map((l) => l.id),
            }))
          )
          .withUsers([timeline.user, ...timeline.messages.map((m) => m.author)])
          .withNotLoadingTimelineOf({ user: timeline.user.id })
      );
    },
    givenMessage(message: Message) {
      testStateBuilderProvider.setState((builder) =>
        builder.withMessages([message])
      );
    },
    givenLike(like: Like) {
      testStateBuilderProvider.setState((builder) => builder.withLikes([like]));
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
    givenLikeMessageWillFail() {
      messageGateway = new FailingMessageGateway();
    },
    givenUnlikeMessageWillFail() {
      messageGateway = new FailingMessageGateway();
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
    async whenAuthUserLikesMessage(likeMessageParams: {
      messageId: string;
      likeId: string;
    }) {
      store = createTestStore(
        { dateProvider, messageGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(likeMessage(likeMessageParams));
    },
    async whenAuthUserUnlikesMessage(unlikeMessageParams: {
      likeId: string;
      messageId: string;
    }) {
      store = createTestStore(
        { dateProvider, messageGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(unlikeMessage(unlikeMessageParams));
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
    thenMessageShouldHaveBeenLiked(like: {
      messageId: string;
      userId: string;
      id: string;
    }) {
      expect((messageGateway as FakeMessageGateway).lastLikeSent).toEqual(like);
    },
    thenMessageShouldHaveBeenUnliked({ id }: { id: string }) {
      expect(
        (messageGateway as FakeMessageGateway).lastUnlikedMessageId
      ).toEqual(id);
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
          expectedTimeline.messages.map((m) => ({
            ...m,
            author: m.author.id,
            likes: m.likes.map((l) => l.id),
          }))
        )
        .withUsers([
          expectedTimeline.user,
          ...expectedTimeline.messages.map((m) => m.author),
        ])
        .withLikes(
          expectedTimeline.messages.flatMap((message) => message.likes)
        )
        .withNotLoadingTimelineOf({ user: expectedTimeline.user.id });

      expectedState =
        expectedTimeline.messageNotPosted === undefined
          ? expectedState.withNoMessagesHavingFailedToBePosted(undefined)
          : expectedState.withMessageNotPosted(
              expectedTimeline.messageNotPosted
            );

      expect(store.getState()).toEqual(expectedState.build());
    },
    thenAppStateShouldBe(stateUpdater: (initialState: RootState) => RootState) {
      const expectedState = stateUpdater(testStateBuilderProvider.getState());

      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
