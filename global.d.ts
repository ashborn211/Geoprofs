// global.d.ts
declare global {
  interface Window {
    hcaptcha: {
      execute: () => Promise<string>;
    };
    handleCaptchaChange: (token: string | null) => void; // Declare the handleCaptchaChange method
  }
}

// Ensure it's a module
export {};
