import { describe, test, expect } from "vitest";
import { HomeViewModelType, selectHomeViewModel } from "../home.viewmodel";
import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";

const getNow = () => "2023-05-17T11:21:00.000Z";

const stateBuilderWithAliceAuthenticated = stateBuilder().withAuthUser({
  authUser: "Alice",
});

describe("Home view model", () => {
  test("Example: there is no timeline in the store", () => {
    const store = createTestStore();

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.NoTimeline,
      },
    });
  });

  test("Example: there is no messages in the timeline", () => {
    const initialState = stateBuilderWithAliceAuthenticated
      .withTimeline({
        id: "alice-timeline-id",
        messages: [],
        user: "Alice",
      })
      .build();
    const store = createTestStore({}, initialState);

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.EmptyTimeline,
        info: "There is no messages yet",
      },
    });
  });

  test("Example: The timeline is loading", () => {
    const initialState = stateBuilderWithAliceAuthenticated
      .withLoadingTimelineOf({ user: "Alice" })
      .build();
    const store = createTestStore({}, initialState);

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.LoadingTimeline,
        info: "Loading...",
      },
    });
  });

  test("Example: there is one message in the timeline", () => {
    const initialState = stateBuilderWithAliceAuthenticated
      .withTimeline({
        id: "alice-timeline-id",
        user: "Alice",
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

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.WithMessages,
        messages: [
          {
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
          },
        ],
      },
    });
  });

  test("Example: there is multiple messages in the timeline", () => {
    const initialState = stateBuilderWithAliceAuthenticated
      .withTimeline({
        id: "alice-timeline-id",
        user: "Alice",
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

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: "TIMELINE_WITH_MESSAGES",
        messages: [
          {
            id: "msg1-id",
            userId: "Bob",
            username: "Bob",
            profilePictureUrl: "https://picsum.photos/200?random=Bob",
            publishedAt: "26 minutes ago",
            text: "Hi it's Bob !",
          },
          {
            id: "msg2-id",
            userId: "Alice",
            username: "Alice",
            profilePictureUrl: "https://picsum.photos/200?random=Alice",
            publishedAt: "22 minutes ago",
            text: "Hi Bob !",
          },
        ],
      },
    });
  });
});
