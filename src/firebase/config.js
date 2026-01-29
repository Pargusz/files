import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXAQugomHsDv7kJc-FU6fbxJrafuoEL_I",
  authDomain: "files-ff8e7.firebaseapp.com",
  projectId: "files-ff8e7",
  storageBucket: "files-ff8e7.firebasestorage.app",
  messagingSenderId: "892200871357",
  appId: "1:892200871357:web:61a56b4c5e405b80f5ded4",
  measurementId: "G-BSYZ24D3GG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
