import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "@/Provider";
import { createTestStore } from "@/lib/create-store";
import { FakeTimelineGateway } from "@/lib/timelines/infra/fake-timeline.gateway";
import { createRouter } from "@/router";
import { stateBuilder } from "@/lib/state-builder";
import { buildUser } from "@/lib/users/__tests__/user.builder";

describe("Get auth user timeline", () => {
  it("displays the authenticated user timeline on the home page", async () => {
    const alice = buildUser({
      id: "alice-id",
      username: "Alice",
    });
    const bob = buildUser({
      id: "bob-id",
      username: "Bob",
    });
    const timelineGateway = new FakeTimelineGateway();
    timelineGateway.timelinesByUser.set("alice-id", {
      id: "alice-timeline-id",
      user: alice,
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: bob,
          publishedAt: "2023-05-16T12:06:00.000Z",
          likes: [],
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: alice,
          publishedAt: "2023-05-16T12:05:00.000Z",
          likes: [],
        },
      ],
    });
    const store = createTestStore(
      {
        timelineGateway,
      },
      stateBuilder().withAuthUser({ authUser: "alice-id" }).build()
    );
    const router = createRouter({ store });
    render(<Provider store={store} router={router} />);

    expect(await screen.findByText("Hello it's Bob")).toBeInTheDocument();
    expect(await screen.findByText("Hello it's Alice")).toBeInTheDocument();
  });
});
