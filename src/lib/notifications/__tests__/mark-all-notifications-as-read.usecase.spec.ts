import { describe, test, beforeEach } from "vitest";
import {
  NotificationFixture,
  createNotificationFixture,
} from "./notification.fixture";
import {
  AuthFixture,
  createAuthFixture,
} from "@/lib/auth/__tests__/auth.fixture";
import { stateBuilderProvider } from "@/lib/state-builder";

describe("Feature: Marking all notifications as read", () => {
  let fixture: NotificationFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createNotificationFixture(testStateBuilderProvider);
  });
  test("Example: Alice has 1 unread notification", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenExistingRemoteNotifications({
      "alice-id": [
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:20:00.000Z",
          url: "https://some.url",
          read: false,
          imageUrl: "image.png",
        },
      ],
    });
    fixture.givenExistingNotifications([
      {
        id: "n1-id",
        title: "Title 1",
        text: "Text 1",
        occuredAt: "2023-06-05T12:20:00.000Z",
        url: "https://some.url",
        read: false,
        imageUrl: "image.png",
      },
    ]);

    await fixture.whenAllNotificationsAreMarkedAsRead();

    fixture.thenNotificationsShouldHaveBeenMarkedRemotely({
      forUser: "alice-id",
    });
    fixture.thenNotificationsShouldBe([
      {
        id: "n1-id",
        title: "Title 1",
        text: "Text 1",
        occuredAt: "2023-06-05T12:20:00.000Z",
        url: "https://some.url",
        read: true,
        imageUrl: "image.png",
      },
    ]);
  });
});
