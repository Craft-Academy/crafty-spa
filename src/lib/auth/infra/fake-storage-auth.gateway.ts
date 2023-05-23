import { AuthGateway } from "../model/auth.gateway";
import { FakeAuthGateway } from "./fake-auth.gateway";

export class FakeStorageAuthGateway implements AuthGateway {
  constructor(private readonly fakeAuthGateway: FakeAuthGateway) {}

  onAuthStateChanged(listener: (user: string) => void): void {
    this.fakeAuthGateway.onAuthStateChanged(listener);
    this.checkIfAuthenticated();
  }

  async authenticateWithGoogle(): Promise<string> {
    const authUser = await this.fakeAuthGateway.authenticateWithGoogle();
    localStorage.setItem("fake-auth", authUser);
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);

    return authUser;
  }

  async authenticateWithGithub(): Promise<string> {
    const authUser = await this.fakeAuthGateway.authenticateWithGithub();
    localStorage.setItem("fake-auth", authUser);
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);

    return authUser;
  }

  private checkIfAuthenticated() {
    const maybeAuthUser = localStorage.getItem("fake-auth");
    if (maybeAuthUser !== null) {
      this.fakeAuthGateway.simulateAuthStateChanged(maybeAuthUser);
    }
  }
}
