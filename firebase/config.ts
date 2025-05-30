// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApT0mTPqNMNRpHCBFYfQhJ8j1cOOAFxo4",
  authDomain: "doi-nhan-xu-the.firebaseapp.com",
  projectId: "doi-nhan-xu-the",
  storageBucket: "doi-nhan-xu-the.firebasestorage.app",
  messagingSenderId: "824418605575",
  appId: "1:824418605575:web:6e62060c937d294e7128a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
