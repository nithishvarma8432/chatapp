// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (copy from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCDqJpGSvUBZYXzozQQ6o1axpQ2NxOSQg0",
  authDomain: "chatapp-a8572.firebaseapp.com",
  projectId: "chatapp-a8572",
  storageBucket: "chatapp-a8572.firebasestorage.app", // Verify this value with your console
  messagingSenderId: "449045660069",
  appId: "1:449045660069:web:477c1ca9628351ce99284c",
  measurementId: "G-ZHH9Q3VT4T"
};

 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
