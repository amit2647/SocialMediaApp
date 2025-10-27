// Import the functions you need from the SDKs
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
} from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase config (from .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Connect to emulators when running locally
if (typeof window !== "undefined" && location.hostname === "localhost") {
  console.log("🔥 Using Firebase Emulators");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

// ✅ Analytics — only enabled in production
let analytics: any = null;

if (typeof window !== "undefined") {
  if (process.env.NODE_ENV === "production") {
    isSupported().then((supported) => {
      if (supported) analytics = getAnalytics(app);
    });
  } else {
    console.log("📊 Analytics disabled in development/emulator mode");
  }
}

// Export modules
export { app, firestore, auth, storage };
