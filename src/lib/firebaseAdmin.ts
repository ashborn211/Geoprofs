import { initializeApp, cert, getApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin'; 
import serviceAccount from '@/FireBase/serviceAccountKey.json'; // Ensure correct path
import { ServiceAccount } from 'firebase-admin';

// Initialize Firebase Admin SDK, if not initialized already
let app: App;
try {
  app = getApp(); // Try to get the default app
} catch (error) {
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app/",
  });
}

// Export Firebase Admin services
const auth = getAuth(app);
const db = admin.firestore(); // Firestore instance

export { auth, db };
