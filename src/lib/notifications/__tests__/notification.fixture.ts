import { expect } from "vitest";
import { stateBuilder, stateBuilderProvider } from "@/lib/state-builder";
import { FakeNotificationGateway } from "../infra/fake-notification.gateway";
import { Notification } from "../model/notification.entity";
import { AppStore, createTestStore } from "@/lib/create-store";
import { getNotifications } from "../usecases/get-notifications.usecase";
import { selectAreNotificationsLoading } from "../slices/notifications.slice";
import { markAllNotificationsAsRead } from "../usecases/mark-all-notifications-as-read.usecase";

export const createNotificationFixture = (
  testStateBuilderProvider = stateBuilderProvider()
) => {
  let store: AppStore;
  const notificationGateway = new FakeNotificationGateway();
  return {
    givenExistingRemoteNotifications(existingNotificationsForUser: {
      [userId: string]: Notification[];
    }) {
      notificationGateway.notifications = new Map(
        Object.entries(existingNotificationsForUser)
      );
    },
    givenExistingNotifications(notifications: Notification[]) {
      testStateBuilderProvider.setState((builder) =>
        builder.withNotifications(notifications)
      );
    },
    async whenRetrievingNotifications() {
      store = createTestStore(
        { notificationGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(getNotifications());
    },
    async whenAllNotificationsAreMarkedAsRead() {
      store = createTestStore(
        { notificationGateway },
        testStateBuilderProvider.getState()
      );
      return store.dispatch(markAllNotificationsAsRead());
    },
    thenNotificationsShouldBeLoading() {
      const areNotificationsLoading = selectAreNotificationsLoading(
        store.getState()
      );
      expect(areNotificationsLoading).toBe(true);
    },
    thenNotificationsShouldHaveBeenMarkedRemotely({
      forUser,
    }: {
      forUser: string;
    }) {
      expect(notificationGateway.lastMarkedNotificationsAsReadForUser).toEqual(
        forUser
      );
    },
    thenNotificationsShouldBe(expectedNotifications: Notification[]) {
      const expectedState = stateBuilder(testStateBuilderProvider.getState())
        .withNotificationsNotLoading(undefined)
        .withNotifications(expectedNotifications)
        .build();

      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type NotificationFixture = ReturnType<typeof createNotificationFixture>;
