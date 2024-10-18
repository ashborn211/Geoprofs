import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom", // For React component testing

  // Automatically transform TypeScript files using ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Customize module name mapping if you're using custom path aliases in Next.js
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",  // This assumes you have an `@` alias in Next.js
  },

  // Ignore transforming node_modules
  transformIgnorePatterns: [
    "/node_modules/",
  ],

  // Configure file extensions Jest should be able to resolve
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  // Coverage settings if you need specific folder coverage
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Adjust according to your project's folder structure
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Include any setup file like testing-library
};

export default config;
