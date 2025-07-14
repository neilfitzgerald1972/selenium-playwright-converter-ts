// Mock console for cleaner test output
// Create a proxy to handle all console methods
const mockConsole: Console = new Proxy(console, {
  get(target: Console, prop: string | symbol): unknown {
    // Mock these methods
    if (['log', 'info', 'debug'].includes(prop as string)) {
      return jest.fn();
    }
    // Pass through other methods
    return target[prop as keyof Console];
  },
});

// Only override in test environment
if (process.env.NODE_ENV === 'test') {
  // Replace console with our mock
  Object.defineProperty(global, 'console', {
    value: mockConsole,
    configurable: true,
    writable: true,
  });
}

export {};
