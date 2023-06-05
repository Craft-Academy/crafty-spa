import { EMPTY_ARGS, createTestStore } from "@/lib/create-store";
import { it, expect } from "vitest";
import { getNotifications } from "../usecases/get-notifications.usecase";
import { userAuthenticated } from "@/lib/auth/reducer";

it("Should get the user notifications on user authenticated event", () => {
  const store = createTestStore();

  store.dispatch(
    userAuthenticated({ authUser: { id: "alice-id", username: "alice" } })
  );

  expect(store.getDispatchedUseCaseArgs(getNotifications)).toEqual(EMPTY_ARGS);
});
