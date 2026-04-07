import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA6zgjEBYI5Aw7ez2cG7o7kWk-xaznQ-fo",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "faahad-blog.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "faahad-blog",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "faahad-blog.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1071658490147",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1071658490147:web:2d0703e784956c3b9a1496",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const serverDb = getFirestore(app);
export const serverStorage = getStorage(app);
