import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'; // Mock image
  },
}));
