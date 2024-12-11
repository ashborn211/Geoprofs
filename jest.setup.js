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
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'fake-api-key', // This key doesn't need to be real for the emulator
  authDomain: 'localhost',
  projectId: 'test-project',
};

beforeAll(() => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://localhost:9099');
});

// Polyfill fetch
import 'whatwg-fetch';  // Add this line to polyfill fetch

// Jest DOM for extended assertions
import '@testing-library/jest-dom';  // Add this line
