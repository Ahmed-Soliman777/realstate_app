// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-24ca4.firebaseapp.com",
  projectId: "mern-estate-24ca4",
  storageBucket: "mern-estate-24ca4.appspot.com",
  messagingSenderId: "105476989414",
  appId: "1:105476989414:web:4402c0ca7079dd70b4f627",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
