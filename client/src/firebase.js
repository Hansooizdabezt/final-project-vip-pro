/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "asm-final-project.firebaseapp.com",
  projectId: "asm-final-project",
  storageBucket: "asm-final-project.appspot.com",
  messagingSenderId: "20306410084",
  appId: "1:20306410084:web:78deafe7ee6f9efb49bd71",
  measurementId: "G-ZH398X4VPR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
