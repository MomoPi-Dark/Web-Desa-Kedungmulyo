import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  addDoc,
  collection,
  collectionGroup,
  getFirestore,
} from "firebase/firestore";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(firebase_app);
const database = getDatabase(firebase_app);

export {
  addDoc,
  collection,
  collectionGroup,
  database,
  firebase_app,
  firestore,
};
