import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { it, expect } from "vitest";
import { FakeNotificationGateway } from "../infra/fake-notification.gateway";
import { onNewNotificationsReceived } from "../listeners/on-new-notification-received.listener";

it("should add the notification in the store when new notification is received", () => {
  const initialState = stateBuilder()
    .withAuthUser({ authUser: "alice-id" })
    .withNotifications([
      {
        id: "n2-id",
        title: "Title 2",
        text: "Text 2",
        occuredAt: "2023-06-05T12:19:00.000Z",
        url: "https://some2.url",
        read: true,
        imageUrl: "image2.png",
      },
    ])
    .build();
  const notificationGateway = new FakeNotificationGateway();
  const store = createTestStore({ notificationGateway }, initialState);
  onNewNotificationsReceived({
    dispatch: store.dispatch,
    getState: store.getState,
    notificationGateway,
  });

  notificationGateway.simulateNewNotificationReceived("alice-id", {
    id: "n1-id",
    title: "Title 1",
    text: "Text 1",
    occuredAt: "2023-06-05T12:20:00.000Z",
    url: "https://some.url",
    read: false,
    imageUrl: "image.png",
  });

  const expectedState = stateBuilder(initialState)
    .withNotifications([
      {
        id: "n2-id",
        title: "Title 2",
        text: "Text 2",
        occuredAt: "2023-06-05T12:19:00.000Z",
        url: "https://some2.url",
        read: true,
        imageUrl: "image2.png",
      },
      {
        id: "n1-id",
        title: "Title 1",
        text: "Text 1",
        occuredAt: "2023-06-05T12:20:00.000Z",
        url: "https://some.url",
        read: false,
        imageUrl: "image.png",
      },
    ])
    .build();
  expect(expectedState).toEqual(store.getState());
});
