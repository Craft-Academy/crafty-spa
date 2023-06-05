import { it, expect } from "vitest";
import { FakeNotificationGateway } from "../infra/fake-notification.gateway";
import { createTestStore } from "@/lib/create-store";
import { userAuthenticated } from "@/lib/auth/reducer";

it("Should listen to new notifications on user authenticated", () => {
  const notificationGateway = new FakeNotificationGateway();
  const store = createTestStore({ notificationGateway });

  store.dispatch(
    userAuthenticated({ authUser: { id: "bob-id", username: "Bob" } })
  );

  expect(notificationGateway.listenerByUser.get("bob-id")).toBeDefined();
});
