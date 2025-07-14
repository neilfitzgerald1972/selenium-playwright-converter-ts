/* eslint-disable no-console */
// Global teardown for Jest tests
export default async function globalTeardown(): Promise<void> {
  // Give a moment for any remaining async operations to complete
  await new Promise(resolve => setTimeout(resolve, 100));

  // Force cleanup any remaining timers
  if (typeof global.clearTimeout === 'function') {
    // Clear any remaining timeouts (though they should already be cleaned up)
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  console.log('Global teardown completed');
}
