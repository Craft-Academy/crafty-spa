import { describe, test, vitest, expect } from "vitest";
import { FirebaseAuthGateway } from "../firebase-auth.gateway";
import {
  GoogleAuthProvider,
  Auth,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";

vitest.mock("firebase/auth", async (importOriginal) => {
  const mod = (await importOriginal()) as any;
  let authStateChangedListener: (user: User | null) => void = () => {
    return;
  };
  let stubSignInWithPopupUser: Partial<UserCredential>;
  const onAuthStateChanged = (
    auth: Auth,
    listener: (user: User | null) => void
  ) => {
    authStateChangedListener = listener;
  };
  const signInWithPopup = async () => {
    return stubSignInWithPopupUser;
  };
  signInWithPopup.setStubUserCredential = (
    userCredential: Partial<UserCredential>
  ) => {
    stubSignInWithPopupUser = userCredential;
  };
  onAuthStateChanged.triggerChange = (user: User | null) =>
    authStateChangedListener(user);
  return {
    ...mod,
    onAuthStateChanged,
    signInWithPopup,
  };
});

describe("FirebaseAuthGateway", () => {
  test("adds correct google provider scope", () => {
    const addScope = vitest.fn();
    new FirebaseAuthGateway({
      addScope,
    } as unknown as GoogleAuthProvider);

    expect(addScope).toHaveBeenCalledWith(
      "https://www.googleapis.com/auth/userinfo.profile"
    );
  });
  test("onAuthStateChanged", () => {
    const listener = vitest.fn();
    const authGateway = new FirebaseAuthGateway();
    const mockedOnAuthStateChanged = onAuthStateChanged as any;
    authGateway.onAuthStateChanged(listener);

    mockedOnAuthStateChanged.triggerChange({
      uid: "alice-id",
      displayName: "Alice",
      photoURL: "alice.png",
    });

    expect(listener).toHaveBeenCalledWith({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });
  });

  test("authenticateWithGoogle", async () => {
    const mockedSignInWithPopup = signInWithPopup as any;
    mockedSignInWithPopup.setStubUserCredential({
      user: {
        uid: "alice-id",
        displayName: "Alice",
        photoURL: "alice.png",
      },
    });
    const authGateway = new FirebaseAuthGateway();

    const user = await authGateway.authenticateWithGoogle();

    expect(user).toEqual({
      id: "alice-id",
      username: "Alice",
      profilePicture: "alice.png",
    });
  });
});
