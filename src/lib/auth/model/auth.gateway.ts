export type AuthUser = {
  id: string;
  username: string;
  profilePicture?: string;
};

export interface AuthGateway {
  onAuthStateChanged(listener: (user: AuthUser) => void): void;
  authenticateWithGoogle(): Promise<AuthUser>;
  authenticateWithGithub(): Promise<AuthUser>;
}
