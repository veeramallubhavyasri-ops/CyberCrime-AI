import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration provided for CyberCrime AI
export const firebaseConfig = {
  apiKey: "AIzaSyBSSuifdYIOezlCr-IKJe6RnWfR7kwpbok",
  authDomain: "cybercrimeai-cf3f6.firebaseapp.com",
  projectId: "cybercrimeai-cf3f6",
  storageBucket: "cybercrimeai-cf3f6.firebasestorage.app",
  messagingSenderId: "127618791731",
  appId: "1:127618791731:web:9b0802ec19da0062f1a646",
  measurementId: "G-31JQ0G3TV3",
};

// Initialize Firebase app (singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Analytics safely (only when supported in browser environment)
export const initAnalytics = async () => {
  try {
    if (typeof window !== "undefined" && (await isSupported())) {
      return getAnalytics(app);
    }
  } catch (err) {
    console.warn("Firebase Analytics could not be initialized:", err);
  }
  return null;
};
