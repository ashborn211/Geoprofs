import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
<<<<<<<< HEAD:src/FireBase/FireBaseConfig.tsx
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
========
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
>>>>>>>> verlof-component-fixes:FireBaseConfig.jsx

const firebaseConfig = {
  apiKey: "AIzaSyCGPXI9a5y1kYgNmW-bd7kcEXtzPBrDC7M",
  authDomain: "geoprofs-3f4e4.firebaseapp.com",
  databaseURL:
    "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "geoprofs-3f4e4",
  storageBucket: "geoprofs-3f4e4.appspot.com",
  messagingSenderId: "956083793044",
  appId: "1:956083793044:web:f1674b50fae72ccf18d881",
  measurementId: "G-ZFMSVSN97W",
};

const app = initializeApp(firebaseConfig);
<<<<<<<< HEAD:src/FireBase/FireBaseConfig.tsx

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const database = getDatabase(app);

// Verbindt niet meer met de emulator, dus deze sectie is verwijderd
// Als je in de toekomst de emulator wilt gebruiken, kun je deze sectie opnieuw toevoegen.

// Ensure that authentication state is persistent across page reloads
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local storage.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
========
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);
const provider = new GoogleAuthProvider();
>>>>>>>> verlof-component-fixes:FireBaseConfig.jsx
