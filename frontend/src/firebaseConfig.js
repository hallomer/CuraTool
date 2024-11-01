// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC78hcCxUIcL6PZxZT0M83_t9_ixQ37dFs",
  authDomain: "curatool-a9049.firebaseapp.com",
  projectId: "curatool-a9049",
  storageBucket: "curatool-a9049.appspot.com",
  messagingSenderId: "242223982866",
  appId: "1:242223982866:web:edc8bd77c7e2b13c1bebcb",
  measurementId: "G-MZ1VMLK3QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
