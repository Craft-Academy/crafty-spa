import { z } from "zod";
import { AuthGateway, AuthUser } from "../model/auth.gateway";
import { FakeAuthGateway } from "./fake-auth.gateway";

export class FakeStorageAuthGateway implements AuthGateway {
  constructor(private readonly fakeAuthGateway: FakeAuthGateway) {}

  onAuthStateChanged(listener: (user: AuthUser) => void): void {
    this.fakeAuthGateway.onAuthStateChanged(listener);
    this.checkIfAuthenticated();
  }

  async authenticateWithGoogle(): Promise<AuthUser> {
    const authUser = await this.fakeAuthGateway.authenticateWithGoogle();
    localStorage.setItem("fake-auth", JSON.stringify(authUser));
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);

    return authUser;
  }

  async authenticateWithGithub(): Promise<AuthUser> {
    const authUser = await this.fakeAuthGateway.authenticateWithGithub();
    localStorage.setItem("fake-auth", JSON.stringify(authUser));
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);

    return authUser;
  }

  private checkIfAuthenticated() {
    const maybeAuthUser = localStorage.getItem("fake-auth");

    if (maybeAuthUser !== null) {
      try {
        const jsonAuthUser = JSON.parse(maybeAuthUser);
        const AuthUserSchema = z.object({
          id: z.string(),
          username: z.string(),
          profilePicture: z.string().optional(),
        });
        const authUserResult = AuthUserSchema.safeParse(jsonAuthUser);
        if (authUserResult.success) {
          const authUser: AuthUser = {
            id: authUserResult.data.id,
            username: authUserResult.data.username,
            profilePicture: authUserResult.data.profilePicture,
          };
          this.fakeAuthGateway.simulateAuthStateChanged(authUser);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
