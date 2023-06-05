import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { describe, test, expect } from "vitest";
import { FakeAuthGateway } from "../infra/fake-auth.gateway";
import { authenticateWithGithub } from "../usecases/authenticate-with-github.usecase";
import { AuthUser } from "../model/auth.gateway";

describe("Feature: Authenticating with Github", () => {
  test("Example: Alice authenticates with github successfully", async () => {
    givenAuthenticationWithGithubWillSucceedForUser({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });

    await whenUserAuthenticatesWithGithub();

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

function givenAuthenticationWithGithubWillSucceedForUser(authUser: AuthUser) {
  authGateway.willSucceedForGithubAuthForUser = authUser;
}

async function whenUserAuthenticatesWithGithub() {
  return store.dispatch(authenticateWithGithub());
}

function thenUserShouldBeAuthenticated({ authUser }: { authUser: AuthUser }) {
  const expectedState = stateBuilder().withAuthUser({ authUser }).build();
  expect(store.getState()).toEqual(expectedState);
}
