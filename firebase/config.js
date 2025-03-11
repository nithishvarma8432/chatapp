// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Correct Firestore configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDqJpGSvUBZYXzozQQ6o1axpQ2NxOSQg0",
  authDomain: "chatapp-a8572.firebaseapp.com",
  projectId: "chatapp-a8572",
  storageBucket: "chatapp-a8572.appspot.com", // ✅ Fix incorrect storageBucket
  messagingSenderId: "449045660069",
  appId: "1:449045660069:web:477c1ca9628351ce99284c",
  measurementId: "G-ZHH9Q3VT4T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);  // ✅ Ensure Firestore instance is initialized correctly
export const storage = getStorage(app);
