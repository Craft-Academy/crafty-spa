import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "@/Provider";
import { createStore } from "@/lib/create-store";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "@/lib/timelines/infra/fake-timeline.gateway";
import { createRouter } from "@/router";

describe("Get auth user timeline", () => {
  it("displays the authenticated user timeline on the home page", async () => {
    const authGateway = new FakeAuthGateway();
    authGateway.authUser = "Alice";
    const timelineGateway = new FakeTimelineGateway();
    timelineGateway.timelinesByUser.set("Alice", {
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    });
    const store = createStore({
      authGateway,
      timelineGateway,
    });
    const router = createRouter({ store });
    render(<Provider store={store} router={router} />);

    expect(await screen.findByText("Hello it's Bob")).toBeInTheDocument();
    expect(await screen.findByText("Hello it's Alice")).toBeInTheDocument();
  });
});
