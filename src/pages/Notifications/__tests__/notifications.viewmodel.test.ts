import { stateBuilder } from "@/lib/state-builder";
import { describe, it, expect, vitest } from "vitest";
import {
  NotificationsViewModelType,
  createNotificationsViewModel,
} from "../notifications.viewmodel";
import { RootState, createTestStore } from "@/lib/create-store";
import { markAllNotificationsAsRead } from "@/lib/notifications/usecases/mark-all-notifications-as-read.usecase";
import { EMPTY_ARGS } from "@/lib/create-store";
import { AppDispatch } from "@/lib/create-store";

const createTestNotificationsViewModel =
  ({
    now = new Date(),
    lastSeenNotificationId = "",
    setLastSeenNotificationId = vitest.fn(),
    dispatch = vitest.fn(),
  }: {
    now?: Date;
    lastSeenNotificationId?: string;
    setLastSeenNotificationId?: (notificationId: string) => void;
    dispatch?: AppDispatch;
  } = {}) =>
  (rootState: RootState) =>
    createNotificationsViewModel({
      now,
      lastSeenNotificationId,
      setLastSeenNotificationId,
      dispatch,
    })(rootState);

describe("Notifications view model", () => {
  it("should return a loading state when notifications are loading", () => {
    const state = stateBuilder().withNotificationsLoading(undefined).build();

    const viewModel = createTestNotificationsViewModel()(state);

    expect(viewModel).toEqual({
      type: NotificationsViewModelType.NotificationsLoading,
    });
  });

  it("should return 'no notifications' state when there is no notifications loaded", () => {
    const state = stateBuilder().build();

    const viewModel = createTestNotificationsViewModel()(state);

    expect(viewModel).toEqual({
      type: NotificationsViewModelType.NoNotifications,
      message: "Aucune notification",
    });
  });

  it("should return notifications when there are some notifications loaded", () => {
    const setLastSeenNotificationId = vitest.fn();
    const now = new Date("2023-06-05T12:21:00.000Z");
    const state = stateBuilder()
      .withNotifications([
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some1.url",
          read: true,
          imageUrl: "image1.png",
        },
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "2023-06-05T12:20:00.000Z",
          url: "https://some2.url",
          read: false,
          imageUrl: "image2.png",
        },
      ])
      .build();

    const viewModel = createTestNotificationsViewModel({
      now,
      setLastSeenNotificationId,
      lastSeenNotificationId: "",
    })(state);

    expect(viewModel).toMatchObject({
      type: NotificationsViewModelType.NotificationsLoaded,
      notifications: [
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "1 minute ago",
          url: "https://some2.url",
          read: false,
          imageUrl: "image2.png",
        },
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2 minutes ago",
          url: "https://some1.url",
          read: true,
          imageUrl: "image1.png",
        },
      ],
      newNotifications: "",
    });
    expect(setLastSeenNotificationId).toHaveBeenCalledWith("n2-id");
  });

  it("should not display notifications received after the last one seen", () => {
    const state = stateBuilder()
      .withNotifications([
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some1.url",
          read: true,
          imageUrl: "image1.png",
        },
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "2023-06-05T12:20:00.000Z",
          url: "https://some2.url",
          read: false,
          imageUrl: "image2.png",
        },
      ])
      .build();

    const viewModel = createTestNotificationsViewModel({
      lastSeenNotificationId: "n1-id",
    })(state);

    expect(viewModel).toMatchObject({
      type: NotificationsViewModelType.NotificationsLoaded,
      notifications: [
        expect.objectContaining({
          id: "n1-id",
          title: "Title 1",
        }),
      ],
      newNotifications: "1 nouvelle(s) notification(s)",
    });
  });

  it("should notify about new last seen notification id when displaying new notifications and mark notifications as read", () => {
    const setLastSeenNotificationId = vitest.fn();
    const state = stateBuilder()
      .withNotifications([
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some1.url",
          read: true,
          imageUrl: "image1.png",
        },
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "2023-06-05T12:20:00.000Z",
          url: "https://some2.url",
          read: false,
          imageUrl: "image2.png",
        },
      ])
      .build();
    const store = createTestStore({}, state);
    const viewModel = createTestNotificationsViewModel({
      lastSeenNotificationId: "n1-id",
      setLastSeenNotificationId,
      dispatch: store.dispatch,
    })(store.getState());

    if (viewModel.type === NotificationsViewModelType.NotificationsLoaded) {
      viewModel.displayNewNotifications();

      expect(setLastSeenNotificationId).toHaveBeenCalledWith("n2-id");
      expect(
        store.getDispatchedUseCaseArgs(markAllNotificationsAsRead)
      ).toEqual(EMPTY_ARGS);
    }
  });
});
