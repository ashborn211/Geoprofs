// Mock Firebase authentication
jest.mock("firebase/auth", () => ({
    signOut: jest.fn(() => Promise.resolve()),
  }));
  
  // Mock Firestore configuration
  jest.mock("firebase/firestore", () => ({
    getDocs: jest.fn(() => Promise.resolve([])),
    addDoc: jest.fn(() => Promise.resolve()),
    collection: jest.fn(),
    Timestamp: {
      fromDate: (date) => date,
    },
  }));
  
  // Setup a mock for ResizeObserver to prevent Jest errors with resize events
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  