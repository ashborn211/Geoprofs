// Mock ResizeObserver
global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Firebase emulator setup

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

const firebaseConfig = {
  apiKey: 'fake-api-key',
  authDomain: 'localhost',
  projectId: 'test-project',
};

let app; // Remove type annotation

beforeAll(() => {
  app = initializeApp(firebaseConfig);

  // Set up Firebase Authentication emulator
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099");

  // Set up Firestore emulator
  const db = getFirestore(app);
  connectFirestoreEmulator(db, "localhost", 8080);
});

export { app };