import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "website-84438.firebaseapp.com",
  projectId: "website-84438",
  storageBucket: "website-84438",
  messagingSenderId: "275122731412",
  appId: "1:275122731412:web:e611b01d2e5b5645637781",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);