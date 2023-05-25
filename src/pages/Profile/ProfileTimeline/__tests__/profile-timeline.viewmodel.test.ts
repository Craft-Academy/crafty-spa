import { describe, test, expect } from "vitest";
import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import {
  ProfileTimelineViewModelType,
  selectProfileTimelineViewModel,
} from "../profile-timeline.viewmodel";

const getNow = () => "2023-05-17T11:21:00.000Z";

describe("Profile timeline view model for Bob's profile", () => {
  test("Example: there is no timeline in the store", () => {
    const store = createTestStore();

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: "Bob",
      getNow,
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

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: "Bob",
      getNow,
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

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: "Bob",
      getNow,
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

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: "Bob",
      getNow,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        id: "bob-timeline-id",
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

    const profileTimelineViewModel = selectProfileTimelineViewModel({
      userId: "Bob",
      getNow,
    })(store.getState());

    expect(profileTimelineViewModel).toEqual({
      timeline: {
        id: "bob-timeline-id",
        type: ProfileTimelineViewModelType.WithMessages,
        messages: [
          {
            id: "msg2-id",
            userId: "Alice",
            username: "Alice",
            profilePictureUrl: "https://picsum.photos/200?random=Alice",
            publishedAt: "22 minutes ago",
            text: "Hi Bob !",
          },
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
});
