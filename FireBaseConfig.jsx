import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCGPXI9a5y1kYgNmW-bd7kcEXtzPBrDC7M",
  authDomain: "geoprofs-3f4e4.firebaseapp.com",
  databaseURL: "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "geoprofs-3f4e4",
  storageBucket: "geoprofs-3f4e4.appspot.com",
  messagingSenderId: "956083793044",
  appId: "1:956083793044:web:f1674b50fae72ccf18d881",
  measurementId: "G-ZFMSVSN97W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);
export const provider = new GoogleAuthProvider();