import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthGateway, AuthUser } from "../model/auth.gateway";

const firebaseConfig = {
  apiKey: "AIzaSyBQRa_nxciRIJJEs6Ld8OUtsL_LA-0UbMc",
  authDomain: "crafty-94b95.firebaseapp.com",
  projectId: "crafty-94b95",
  storageBucket: "crafty-94b95.appspot.com",
  messagingSenderId: "952566003872",
  appId: "1:952566003872:web:ebcf92aa35d87e8c4031c5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export class FirebaseAuthGateway implements AuthGateway {
  private authChangedListener: (user: AuthUser) => void = () => {
    return;
  };
  constructor(private readonly googleProvider = new GoogleAuthProvider()) {
    this.googleProvider.addScope(
      "https://www.googleapis.com/auth/userinfo.profile"
    );
    this.initializeAuthStateChanged();
  }

  private initializeAuthStateChanged() {
    onAuthStateChanged(auth, (maybeUser) => {
      if (maybeUser) {
        this.authChangedListener({
          id: maybeUser.uid,
          username: maybeUser.displayName ?? "",
          profilePicture: maybeUser.photoURL ?? undefined,
        });
      }
    });
  }

  onAuthStateChanged(listener: (user: AuthUser) => void): void {
    this.authChangedListener = listener;
  }

  async authenticateWithGoogle(): Promise<AuthUser> {
    const result = await signInWithPopup(auth, this.googleProvider);

    return {
      id: result.user.uid,
      username: result.user.displayName ?? "",
      profilePicture: result.user.photoURL ?? undefined,
    };
  }

  authenticateWithGithub(): Promise<AuthUser> {
    throw new Error("Method not implemented.");
  }
}
