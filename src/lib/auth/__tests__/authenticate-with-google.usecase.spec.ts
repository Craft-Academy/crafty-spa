import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { describe, test, expect } from "vitest";
import { authenticateWithGoogle } from "../usecases/authenticate-with-google.usecase";
import { FakeAuthGateway } from "../infra/fake-auth.gateway";
import { AuthUser } from "../model/auth.gateway";

describe("Feature: Authenticating with Google", () => {
  test("Example: Alice authenticates with google successfully", async () => {
    givenAuthenticationWithGoogleWillSucceedForUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });

    await whenUserAuthenticatesWithGoogle();

    thenUserShouldBeAuthenticated({
      authUser: {
        id: "alice-id",
        username: "Alice",
        profilePicture: "alice.png",
      },
    });
  });
});

const authGateway = new FakeAuthGateway();
const store = createTestStore({
  authGateway,
});

function givenAuthenticationWithGoogleWillSucceedForUser(authUser: AuthUser) {
  authGateway.willSucceedForGoogleAuthForUser = authUser;
}

async function whenUserAuthenticatesWithGoogle() {
  return store.dispatch(authenticateWithGoogle());
}

function thenUserShouldBeAuthenticated({ authUser }: { authUser: AuthUser }) {
  const expectedState = stateBuilder().withAuthUser({ authUser }).build();
  expect(store.getState()).toEqual(expectedState);
}
