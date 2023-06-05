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

describe("Feature: Retrieving authenticated user notifications", () => {
  let fixture: NotificationFixture;
  let authFixture: AuthFixture;
  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    authFixture = createAuthFixture(testStateBuilderProvider);
    fixture = createNotificationFixture(testStateBuilderProvider);
  });
  test("Example: Alice is authenticated and has no notifications", async () => {
    authFixture.givenAuthenticatedUserIs("alice-id");
    fixture.givenExistingRemoteNotifications({ "alice-id": [] });

    const notificationsRetrieving = fixture.whenRetrievingNotifications();

    fixture.thenNotificationsShouldBeLoading();
    await notificationsRetrieving;
    fixture.thenNotificationsShouldBe([]);
  });

  test("Example: Alice is authenticated and has few notifications", async () => {
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
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some2.url",
          read: true,
          imageUrl: "image2.png",
        },
      ],
    });

    const notificationsRetrieving = fixture.whenRetrievingNotifications();

    fixture.thenNotificationsShouldBeLoading();
    await notificationsRetrieving;
    fixture.thenNotificationsShouldBe([
      {
        id: "n1-id",
        title: "Title 1",
        text: "Text 1",
        occuredAt: "2023-06-05T12:20:00.000Z",
        url: "https://some.url",
        read: false,
        imageUrl: "image.png",
      },
      {
        id: "n2-id",
        title: "Title 2",
        text: "Text 2",
        occuredAt: "2023-06-05T12:19:00.000Z",
        url: "https://some2.url",
        read: true,
        imageUrl: "image2.png",
      },
    ]);
  });
});
