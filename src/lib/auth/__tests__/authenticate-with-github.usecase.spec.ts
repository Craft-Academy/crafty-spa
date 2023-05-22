import { createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { describe, test, expect } from "vitest";
import { FakeAuthGateway } from "../infra/fake-auth.gateway";
import { authenticateWithGithub } from "../usecases/authenticate-with-github.usecase";

describe("Feature: Authenticating with Github", () => {
  test("Example: Alice authenticates with github successfully", async () => {
    givenAuthenticationWithGithubWillSucceedForUser("Alice");

    await whenUserAuthenticatesWithGithub();

    thenUserShouldBeAuthenticated({ authUser: "Alice" });
  });
});

const authGateway = new FakeAuthGateway();
const store = createTestStore({
  authGateway,
});

function givenAuthenticationWithGithubWillSucceedForUser(authUser: string) {
  authGateway.willSucceedForGithubAuthForUser = authUser;
}

async function whenUserAuthenticatesWithGithub() {
  return store.dispatch(authenticateWithGithub());
}

function thenUserShouldBeAuthenticated({ authUser }: { authUser: string }) {
  const expectedState = stateBuilder().withAuthUser({ authUser }).build();
  expect(store.getState()).toEqual(expectedState);
}
