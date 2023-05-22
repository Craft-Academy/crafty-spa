import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { describe, test, expect } from "vitest";
import { authenticateWithGoogle } from "../usecases/authenticate-with-google.usecase";
import { FakeAuthGateway } from "../infra/fake-auth.gateway";

describe("Feature: Authenticating with Google", () => {
  test("Example: Alice authenticates with google successfully", async () => {
    givenAuthenticationWithGoogleWillSucceedForUser("Alice");

    await whenUserAuthenticatesWithGoogle();

    thenUserShouldBeAuthenticated({ authUser: "Alice" });
  });
});

const authGateway = new FakeAuthGateway();
const store = createTestStore({
  authGateway,
});

function givenAuthenticationWithGoogleWillSucceedForUser(authUser: string) {
  authGateway.willSucceedForGoogleAuthForUser = authUser;
}

async function whenUserAuthenticatesWithGoogle() {
  return store.dispatch(authenticateWithGoogle());
}

function thenUserShouldBeAuthenticated({ authUser }: { authUser: string }) {
  const expectedState = stateBuilder().withAuthUser({ authUser }).build();
  expect(store.getState()).toEqual(expectedState);
}
