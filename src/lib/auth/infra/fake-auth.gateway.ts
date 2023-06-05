import { AuthGateway, AuthUser } from "../model/auth.gateway";

export class FakeAuthGateway implements AuthGateway {
  willSucceedForGoogleAuthForUser!: AuthUser;
  willSucceedForGithubAuthForUser!: AuthUser;

  onAuthStateChangedListener: (user: AuthUser) => void = () => {
    return;
  };

  constructor(private readonly delay = 0) {}
  onAuthStateChanged(listener: (user: AuthUser) => void): void {
    this.onAuthStateChangedListener = listener;
  }

  authenticateWithGoogle(): Promise<AuthUser> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.willSucceedForGoogleAuthForUser),
        this.delay
      )
    );
  }

  authenticateWithGithub(): Promise<AuthUser> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.willSucceedForGithubAuthForUser),
        this.delay
      )
    );
  }

  simulateAuthStateChanged(authUser: AuthUser) {
    this.onAuthStateChangedListener(authUser);
  }
}

export const authGateway = new FakeAuthGateway();
