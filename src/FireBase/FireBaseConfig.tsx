import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCGPXI9a5y1kYgNmW-bd7kcEXtzPBrDC7M",
  authDomain: "geoprofs-3f4e4.firebaseapp.com",
  databaseURL:
    "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "geoprofs-3f4e4",
  storageBucket: "geoprofs-3f4e4.appspot.com",
  messagingSenderId: "956083793044",
  appId: "1:956083793044:web:f1674b50fae72ccf18d881",
  measurementId: "G-ZFMSVSN97W",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const database = getDatabase(app); // Initialize the database

// Connect to the emulator if in development mode
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099"); // Connect Auth emulator
  connectFirestoreEmulator(db, "localhost", 8080); // Connect Firestore emulator
  connectDatabaseEmulator(database, "localhost", 9000); // Connect Database emulator
}

// Ensure that authentication state is persistent across page reloads
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local storage.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
