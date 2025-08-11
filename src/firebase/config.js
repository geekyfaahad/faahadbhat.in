import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6zgjEBYI5Aw7ez2cG7o7kWk-xaznQ-fo",
  authDomain: "faahad-blog.firebaseapp.com",
  projectId: "faahad-blog",
  storageBucket: "faahad-blog.firebasestorage.app",
  messagingSenderId: "1071658490147",
  appId: "1:1071658490147:web:2d0703e784956c3b9a1496",
  measurementId: "G-MMNQLY1955"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics }; 