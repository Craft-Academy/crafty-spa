import { describe, test, expect } from "vitest";
import { HomeViewModelType, selectHomeViewModel } from "../home.viewmodel";
import { createTestStore } from "@/lib/create-store";

const getNow = () => "2023-05-17T11:21:00.000Z";

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
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: [],
              user: "Alice",
            },
          },
          loadingTimelinesByUser: {},
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.EmptyTimeline,
        info: "There is no messages yet",
      },
    });
  });

  test("Example: The timeline is loading", () => {
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: [],
          entities: {},
          loadingTimelinesByUser: {
            Alice: true,
          },
        },
      }
    );

    const homeViewModel = selectHomeViewModel(store.getState(), getNow);

    expect(homeViewModel).toEqual({
      timeline: {
        type: HomeViewModelType.LoadingTimeline,
        info: "Loading...",
      },
    });
  });

  test("Example: there is one message in the timeline", () => {
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: ["msg1-id"],
              user: "Alice",
            },
          },
          loadingTimelinesByUser: {},
        },
        messages: {
          ids: ["msg1-id"],
          entities: {
            "msg1-id": {
              id: "msg1-id",
              author: "Bob",
              publishedAt: "2023-05-17T10:55:00.000Z",
              text: "Hi it's Bob !",
            },
          },
        },
      }
    );

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
    const store = createTestStore(
      {},
      {
        timelines: {
          ids: ["alice-timeline-id"],
          entities: {
            "alice-timeline-id": {
              id: "alice-timeline-id",
              messages: ["msg1-id", "msg2-id"],
              user: "Alice",
            },
          },
          loadingTimelinesByUser: {},
        },
        messages: {
          ids: ["msg1-id", "msg2-id", "msg3-id"],
          entities: {
            "msg1-id": {
              id: "msg1-id",
              author: "Bob",
              publishedAt: "2023-05-17T10:55:00.000Z",
              text: "Hi it's Bob !",
            },
            "msg2-id": {
              id: "msg2-id",
              author: "Alice",
              publishedAt: "2023-05-17T10:59:00.000Z",
              text: "Hi Bob !",
            },
            "msg3-id": {
              id: "msg3-id",
              author: "Charles",
              publishedAt: "2023-05-17T11:00:00.000Z",
              text: "Charles' message",
            },
          },
        },
      }
    );

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