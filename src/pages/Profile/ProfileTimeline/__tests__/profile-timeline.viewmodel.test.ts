import { describe, test, expect, vitest } from "vitest";
import { AppDispatch, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import {
  ProfileTimelineViewModelType,
  createProfileTimelineViewModel,
} from "../profile-timeline.viewmodel";
import { postMessage } from "@/lib/timelines/usecases/post-message.usecase";

type MessageView = {
  id: string;
  userId: string;
  username: string;
  profilePictureUrl: string;
  publishedAt: string;
  text: string;
  failedToBePosted: boolean;
  backgroundColor: string;
  errorMessage?: string;
};

const createMessageView = ({
  id = "msg-id",
  userId = "user-id",
  username = "username",
  profilePictureUrl = "http://profile-picture.png",
  publishedAt = "42 minutes ago",
  text = "Hello World",
  backgroundColor = "white",
  failedToBePosted = false,
  errorMessage,
}: Partial<MessageView> = {}): MessageView => {
  return {
    id,
    userId,
    username,
    profilePictureUrl,
    publishedAt,
    text,
    backgroundColor,
    failedToBePosted,
    errorMessage,
  };
};

const createTestProfileTimelineViewModel = ({
  userId,
  getNow = () => "2023-05-17T11:21:00.000Z",
  dispatch = vitest.fn(),
}: {
  userId: string;
  getNow?: () => string;
  dispatch?: AppDispatch;
}) =>
  createProfileTimelineViewModel({
    userId,
    getNow,
    dispatch,
  });

describe("Profile timeline view model for Bob's profile", () => {
  test("Example: there is no timeline in the store", () => {
    const store = createTestStore();

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.NoTimeline,
      },
    });
  });

  test("Example: there is no messages in the timeline", () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        messages: [],
        user: "Bob",
      })
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.EmptyTimeline,
        info: "There is no messages yet",
      },
    });
  });

  test("Example: The timeline is loading", () => {
    const initialState = stateBuilder()
      .withLoadingTimelineOf({ user: "Bob" })
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.LoadingTimeline,
        info: "Loading...",
      },
    });
  });

  test("Example: there is one message in the timeline", () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "Bob",
        messages: ["msg1-id"],
      })
      .withMessages([
        {
          id: "msg1-id",
          author: "Bob",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        },
      ])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        id: "bob-timeline-id",
        messages: [
          createMessageView({
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
            backgroundColor: "white",
          }),
        ],
      },
    });
  });

  test("Example: there is multiple messages in the timeline : messages are displayed by published date desc", () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "Bob",
        messages: ["msg1-id", "msg2-id"],
      })
      .withMessages([
        {
          id: "msg1-id",
          author: "Bob",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        },
        {
          id: "msg2-id",
          author: "Alice",
          publishedAt: "2023-05-17T10:59:00.000Z",
          text: "Hi Bob !",
        },
        {
          id: "msg3-id",
          author: "Charles",
          publishedAt: "2023-05-17T11:00:00.000Z",
          text: "Charles' message",
        },
      ])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        id: "bob-timeline-id",
        type: ProfileTimelineViewModelType.WithMessages,
        messages: [
          createMessageView({
            id: "msg2-id",
            userId: "Alice",
            username: "Alice",
            profilePictureUrl: "https://picsum.photos/200?random=Alice",
            publishedAt: "22 minutes ago",
            text: "Hi Bob !",
          }),
          createMessageView({
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
          }),
        ],
      },
    });
  });
  test("Example: the message could not have been posted", () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "Bob",
        messages: ["msg1-id"],
      })
      .withMessages([
        {
          id: "msg1-id",
          author: "Bob",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        },
      ])
      .withMessageNotPosted({
        messageId: "msg1-id",
        error: "Cannot post message",
      })
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        id: "bob-timeline-id",
        messages: [
          createMessageView({
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
            failedToBePosted: true,
            errorMessage: "Cannot post message",
            backgroundColor: "red.50",
          }),
        ],
      },
    });
  });

  test("Example: the message not posted can be retried", () => {
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "Bob",
        messages: ["msg1-id"],
      })
      .withMessages([
        {
          id: "msg1-id",
          author: "Bob",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        },
      ])
      .withMessageNotPosted({
        messageId: "msg1-id",
        error: "Cannot post message",
      })
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "Bob",
      getNow: () => "2023-05-17T11:21:00.000Z",
      dispatch: store.dispatch,
    })(store.getState());

    if (
      profileTimelineViewModel.timeline.type ===
      ProfileTimelineViewModelType.WithMessages
    ) {
      profileTimelineViewModel.timeline.messages[0].retryToPostMessage();
      expect(store.getDispatchedUseCaseArgs(postMessage)).toEqual({
        messageId: "msg1-id",
        timelineId: "bob-timeline-id",
        text: "Hi it's Bob !",
      });
    }
  });
});
