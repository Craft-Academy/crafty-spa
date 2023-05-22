import { AuthGateway } from "../model/auth.gateway";

export class FakeAuthGateway implements AuthGateway {
  willSucceedForGoogleAuthForUser!: string;
  willSucceedForGithubAuthForUser!: string;
  constructor(private readonly delay = 0) {}

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
}

export const authGateway = new FakeAuthGateway();
