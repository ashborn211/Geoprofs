// jest.setup.js
global.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  