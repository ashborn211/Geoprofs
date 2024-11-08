// __tests__/global.d.ts
declare global {
    namespace NodeJS {
      interface Global {
        fetch: jest.Mock;
      }
    }
  }
  
  export {};
  