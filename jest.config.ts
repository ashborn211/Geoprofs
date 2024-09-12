export default {
  preset: 'ts-jest', // Use ts-jest to transpile TypeScript
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Use ts-jest to handle both TypeScript and JavaScript
  },
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handle CSS imports
  },
  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-library|other-esm-library)/)', // If you need to transform specific node_modules
  ],
  setupFilesAfterEnv: ['<rootDir>/src/app/jest.setup.ts'], // Make sure jest.setup.ts is included
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat TypeScript files as ESM
};
