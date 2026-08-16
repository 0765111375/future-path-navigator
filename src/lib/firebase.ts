import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBidlkVLxEVlge2OlePRRHIs6KxPG1L2No",
  authDomain: "nextpath-e39e8.firebaseapp.com",
  projectId: "nextpath-e39e8",
  storageBucket: "nextpath-e39e8.firebasestorage.app",
  messagingSenderId: "172317193024",
  appId: "1:172317193024:web:024094fbaaf3fdfe8200a5",
};

export const AUTH_SESSION_KEY = "nextpath.auth.v1";

export type AuthSession = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  provider?: string;
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  provider?: string;
}) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      provider: user.provider ?? "google",
    }),
  );
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
