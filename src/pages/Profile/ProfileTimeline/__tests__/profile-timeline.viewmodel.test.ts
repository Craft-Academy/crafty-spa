import { describe, test, expect, vitest } from "vitest";
import { AppDispatch, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import {
  ProfileTimelineViewModelType,
  createProfileTimelineViewModel,
} from "../profile-timeline.viewmodel";
import { postMessage } from "@/lib/timelines/usecases/post-message.usecase";
import { buildUser } from "@/lib/users/__tests__/user.builder";
import { buildMessage } from "@/lib/timelines/__tests__/message.builder";

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
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
    });
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "bob-id",
        messages: ["msg1-id"],
      })
      .withMessages([
        buildMessage({
          id: "msg1-id",
          author: "bob-id",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        }),
      ])
      .withUsers([bob])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "bob-id",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        id: "bob-timeline-id",
        messages: [
          createMessageView({
            id: "msg1-id",
            userId: "bob-id",
            username: "Bob",
            profilePictureUrl: "bob.png",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
            backgroundColor: "white",
          }),
        ],
      },
    });
  });

  test("Example: there is multiple messages in the timeline : messages are displayed by published date desc", () => {
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
    });
    const alice = buildUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "bob-id",
        messages: ["msg1-id", "msg2-id"],
      })
      .withMessages([
        buildMessage({
          id: "msg1-id",
          author: "bob-id",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        }),
        buildMessage({
          id: "msg2-id",
          author: "alice-id",
          publishedAt: "2023-05-17T10:59:00.000Z",
          text: "Hi Bob !",
        }),
        buildMessage({
          id: "msg3-id",
          author: "charles-id",
          publishedAt: "2023-05-17T11:00:00.000Z",
          text: "Charles' message",
        }),
      ])
      .withUsers([bob, alice])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "bob-id",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        id: "bob-timeline-id",
        type: ProfileTimelineViewModelType.WithMessages,
        messages: [
          createMessageView({
            id: "msg2-id",
            userId: "alice-id",
            username: "Alice",
            profilePictureUrl: "alice.png",
            publishedAt: "22 minutes ago",
            text: "Hi Bob !",
          }),
          createMessageView({
            id: "msg1-id",
            userId: "bob-id",
            username: "Bob",
            profilePictureUrl: "bob.png",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
          }),
        ],
      },
    });
  });
  test("Example: the message could not have been posted", () => {
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
    });
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "bob-id",
        messages: ["msg1-id"],
      })
      .withMessages([
        buildMessage({
          id: "msg1-id",
          author: "bob-id",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        }),
      ])
      .withMessageNotPosted({
        messageId: "msg1-id",
        error: "Cannot post message",
      })
      .withUsers([bob])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "bob-id",
      getNow: () => "2023-05-17T11:21:00.000Z",
    })(store.getState());

    expect(profileTimelineViewModel).toMatchObject({
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        id: "bob-timeline-id",
        messages: [
          createMessageView({
            id: "msg1-id",
            userId: "bob-id",
            username: "Bob",
            profilePictureUrl: "bob.png",
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
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
      profilePicture: "bob.png",
    });
    const initialState = stateBuilder()
      .withTimeline({
        id: "bob-timeline-id",
        user: "bob-id",
        messages: ["msg1-id"],
      })
      .withMessages([
        buildMessage({
          id: "msg1-id",
          author: "bob-id",
          publishedAt: "2023-05-17T10:55:00.000Z",
          text: "Hi it's Bob !",
        }),
      ])
      .withMessageNotPosted({
        messageId: "msg1-id",
        error: "Cannot post message",
      })
      .withUsers([bob])
      .build();
    const store = createTestStore({}, initialState);

    const profileTimelineViewModel = createTestProfileTimelineViewModel({
      userId: "bob-id",
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
