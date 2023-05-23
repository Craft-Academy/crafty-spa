import { AuthGateway, AuthUser } from "../model/auth.gateway";

export class FakeAuthGateway implements AuthGateway {
  willSucceedForGoogleAuthForUser!: string;
  willSucceedForGithubAuthForUser!: string;

  onAuthStateChangedListener: (user: AuthUser) => void = () => {
    return;
  };

  constructor(private readonly delay = 0) {}
  onAuthStateChanged(listener: (user: string) => void): void {
    this.onAuthStateChangedListener = listener;
  }

  authenticateWithGoogle(): Promise<string> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.willSucceedForGoogleAuthForUser),
        this.delay
      )
    );
  }

  authenticateWithGithub(): Promise<string> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.willSucceedForGithubAuthForUser),
        this.delay
      )
    );
  }

  simulateAuthStateChanged(authUser: string) {
    this.onAuthStateChangedListener(authUser);
  }
}

export const authGateway = new FakeAuthGateway();
