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

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
