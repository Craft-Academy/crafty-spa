import { stateBuilderProvider } from "@/lib/state-builder";
import { AuthUser } from "../model/auth.gateway";

export const createAuthFixture = (
  testStateBuilderProvider = stateBuilderProvider()
) => {
  return {
    givenAuthenticatedUserIs(user: string | AuthUser) {
      testStateBuilderProvider.setState((stateBuilder) =>
        stateBuilder.withAuthUser({ authUser: user })
      );
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
