global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { }
  unobserve() { }
  disconnect() { }
};

import '@testing-library/jest-dom'; // Add this line

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
  connectAuthEmulator: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  initializeFirestore: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  connectDatabaseEmulator: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
}));
