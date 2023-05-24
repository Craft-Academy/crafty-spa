import { stateBuilderProvider } from "@/lib/state-builder";

export const createAuthFixture = (
  testStateBuilderProvider = stateBuilderProvider()
) => {
  return {
    givenAuthenticatedUserIs(user: string) {
      testStateBuilderProvider.setState((stateBuilder) =>
        stateBuilder.withAuthUser({ authUser: user })
      );
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
