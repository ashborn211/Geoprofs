import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin'; // Import admin module to access Firestore, etc.
import serviceAccount from '@/FireBase/serviceAccountKey.json'; // Adjust the path to your JSON file
import { ServiceAccount } from 'firebase-admin'; // Import the ServiceAccount type

// Initialize the Firebase Admin SDK
const app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app/",
});

// Export the auth and other services
const auth = getAuth(app);
const db = admin.firestore(); // Initialize Firestore

export { auth, db };
