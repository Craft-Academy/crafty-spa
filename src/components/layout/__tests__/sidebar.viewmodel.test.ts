import { stateBuilder } from "@/lib/state-builder";
import { describe, it, expect } from "vitest";
import { createSidebarViewModel } from "../sidebar.viewmodel";

describe("Sidebar view model", () => {
  it("only display the notifications label when there is no new notifications", () => {
    const state = stateBuilder().build();

    const viewModel = createSidebarViewModel(state);

    expect(viewModel).toMatchObject({
      notificationLabel: "Notifications",
      unreadNotifications: false,
    });
  });
  it("shows the number of unread notifications when there is one unread notifications", () => {
    const state = stateBuilder()
      .withNotifications([
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some1.url",
          read: false,
          imageUrl: "image1.png",
        },
      ])
      .build();

    const viewModel = createSidebarViewModel(state);

    expect(viewModel).toMatchObject({
      notificationLabel: "Notifications (1)",
      unreadNotifications: true,
    });
  });

  it("shows the number of unread notifications when there are more than one unread notifications", () => {
    const state = stateBuilder()
      .withNotifications([
        {
          id: "n1-id",
          title: "Title 1",
          text: "Text 1",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some1.url",
          read: false,
          imageUrl: "image1.png",
        },
        {
          id: "n2-id",
          title: "Title 2",
          text: "Text 2",
          occuredAt: "2023-06-05T12:19:00.000Z",
          url: "https://some2.url",
          read: false,
          imageUrl: "image2.png",
        },
      ])
      .build();

    const viewModel = createSidebarViewModel(state);

    expect(viewModel).toMatchObject({
      notificationLabel: "Notifications (2)",
      unreadNotifications: true,
    });
  });

  it("show the authenticated user with a link to the profile", () => {
    const state = stateBuilder()
      .withAuthUser({
        authUser: {
          id: "alice-id",
          username: "Alice",
          profilePicture: "alice.png",
        },
      })
      .build();

    const viewModel = createSidebarViewModel(state);

    expect(viewModel.authUser).toEqual({
      username: "Alice",
      profilePicture: "alice.png",
      profileUrl: "/u/alice-id",
    });
  });
});
