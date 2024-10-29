module.exports = {
  preset: 'ts-jest', // Use 'ts-jest' if you're using TypeScript
  testEnvironment: 'jsdom', // Use 'node' if your tests don't rely on DOM
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform JS and JSX files using Babel
    '^.+\\.tsx?$': 'ts-jest', // If you're using TypeScript, transform TS files
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/__test__/babel.config.js',
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Adjust based on your directory structure
  },
  transformIgnorePatterns: [
    "node_modules/(?!your-module-to-transform)", // If you have specific modules to transform
  ],
};
