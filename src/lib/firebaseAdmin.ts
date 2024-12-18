import { initializeApp, cert, getApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import serviceAccount from '@/FireBase/serviceAccountKey.json'; // Ensure the correct path
import { ServiceAccount } from 'firebase-admin';

// Initialize Firebase Admin SDK only if not already initialized
let app: App;

try {
  // Try to get the default app instance
  app = getApp();
} catch (error) {
  // If the app isn't initialized, initialize it
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app/", // Your Realtime Database URL (if needed)
  });
}

// Export Firebase Admin services
const auth = getAuth(app);  // Firebase Authentication service
const db = admin.firestore();  // Firestore service

export { auth, db };
