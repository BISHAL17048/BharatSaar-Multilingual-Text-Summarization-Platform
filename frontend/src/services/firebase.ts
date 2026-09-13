import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with actual config from env later
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
