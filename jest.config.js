module.exports = {
  preset: 'ts-jest', // Uses ts-jest preset for TypeScript support
  testEnvironment: 'jsdom', // Simulates a browser environment
  moduleNameMapper: {
    // Maps module imports for styles and assets to prevent errors
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1', // Aliases @ to src folder
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforms .ts/.tsx files using ts-jest
    '^.+\\.(js|jsx)$': 'babel-jest', // Transforms .js/.jsx files using Babel
  },
  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-package)/)', // Adjust this if you need to transpile ESM packages
  ],
};
