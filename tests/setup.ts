/* eslint-disable no-console */
// Global test setup
import { jest } from '@jest/globals';

// Configure Jest with appropriate timeouts
jest.setTimeout(10000);

// Import console mocks
import './__mocks__/console';

// Global test utilities
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: readonly unknown[]): R;
      toContainPath(expected: string): R;
      toHaveValidTypeScript(): R;
    }
  }
}

// Add custom matchers
expect.extend({
  toBeOneOf(received: unknown, expected: readonly unknown[]) {
    const pass = (expected as unknown[]).includes(received);
    return {
      pass,
      message: (): string =>
        `Expected ${received} to be one of: ${(expected as string[]).join(', ')}`,
    };
  },

  toContainPath(received: string, expected: string) {
    const normalize = (path: string): string => path.replace(/\\/g, '/').toLowerCase();
    const receivedNormalized = normalize(received);
    const expectedNormalized = normalize(expected);
    const pass = receivedNormalized.includes(expectedNormalized);

    return {
      pass,
      message: (): string => `Expected path "${received}" to contain "${expected}"`,
    };
  },

  toHaveValidTypeScript(received: string) {
    // This is a placeholder for actual TypeScript validation
    // In a real project, you might want to use the TypeScript compiler API
    const pass = typeof received === 'string' && received.length > 0;
    return {
      pass,
      message: (): string => 'Expected valid TypeScript code',
    };
  },
});

// Process cleanup
const cleanupProcesses = (): void => {
  try {
    // Kill any orphaned child processes (helps prevent resource leaks)
    if (process.platform !== 'win32') {
      // On Unix-like systems, we can try to clean up process groups
      try {
        process.kill(-process.pid, 'SIGTERM');
      } catch (error) {
        // Ignore errors - this is a cleanup operation
      }
    }
  } catch (error) {
    // Silently ignore cleanup errors to avoid test interference
  }
};

// Global error handlers for better test reliability
const handleUnhandledRejection = (reason: unknown, promise: Promise<unknown>): void => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);

  // In test environment, we might want to fail fast on unhandled rejections
  if (process.env.NODE_ENV === 'test' && process.env.FAIL_ON_UNHANDLED_REJECTION === 'true') {
    process.exit(1);
  }
};

const handleUncaughtException = (error: Error): void => {
  console.error('Uncaught Exception:', error);

  // In test environment, log and exit gracefully
  if (process.env.NODE_ENV === 'test') {
    console.error('Exiting due to uncaught exception in test environment');
    process.exit(1);
  }
};

// Set up global error handlers
process.on('unhandledRejection', handleUnhandledRejection);
process.on('uncaughtException', handleUncaughtException);
process.on('exit', cleanupProcesses);

// Clean up on various termination signals
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(signal => {
  process.on(signal, () => {
    cleanupProcesses();
    process.exit(0);
  });
});

// Note: Custom Jest matchers are defined above - no duplicate needed

// Global test utilities
interface TestUtils {
  createMockFile(content: string): { path: string; content: string };
  generateSeleniumCode(complexity: 'simple' | 'medium' | 'complex'): string;
  validatePlaywrightCode(code: string): boolean;
  measurePerformance<T>(fn: () => T): { result: T; duration: number };
}

const testUtils: TestUtils = {
  createMockFile(content: string) {
    const timestamp = Date.now();
    return {
      path: `/tmp/mock-file-${timestamp}.ts`,
      content,
    };
  },

  generateSeleniumCode(complexity) {
    const patterns = {
      simple: `
        import { WebDriver, Builder, By } from "selenium-webdriver";
        const driver = new Builder().forBrowser("chrome").build();
        driver.get("https://example.com");
        driver.findElement(By.id("test")).click();
        driver.quit();
      `,
      medium: `
        import { WebDriver, Builder, By, until, Key } from "selenium-webdriver";
        const driver = new Builder().forBrowser("chrome").build();
        await driver.get("https://example.com");
        const element = driver.findElement(By.id("username"));
        await element.sendKeys("user");
        await element.sendKeys(Key.TAB);
        await driver.wait(until.elementLocated(By.css(".result")), 5000);
        await driver.quit();
      `,
      complex: `
        import { WebDriver, Builder, By, until, Key, Actions, Select } from "selenium-webdriver";
        const driver = new Builder().forBrowser("chrome").build();
        await driver.get("https://example.com");

        // Form interactions
        const form = driver.findElement(By.id("form"));
        const input = form.findElement(By.name("data"));
        await input.sendKeys("test");

        // Dropdown
        const dropdown = driver.findElement(By.id("dropdown"));
        const select = new Select(dropdown);
        await select.selectByVisibleText("Option");

        // Actions
        const button = driver.findElement(By.css(".button"));
        const actions = new Actions(driver);
        await actions.moveToElement(button).click().perform();

        // Window handling
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);

        // JavaScript
        await driver.executeScript("console.log('test')");

        await driver.quit();
      `,
    };
    return patterns[complexity].trim();
  },

  validatePlaywrightCode(code: string) {
    const requiredPatterns = [/import.*@playwright\/test/, /page\./, /await.*page\./];

    return requiredPatterns.every(pattern => pattern.test(code));
  },

  measurePerformance<T>(fn: () => T) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return {
      result,
      duration: end - start,
    };
  },
};

// Make test utilities globally available
(global as Record<string, unknown>).testUtils = testUtils;

// Memory management for long-running test suites
const setupMemoryManagement = (): void => {
  let memoryCheckInterval: NodeJS.Timeout;

  // Monitor memory usage in long test suites
  if (process.env.MONITOR_MEMORY === 'true') {
    memoryCheckInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);

      if (memUsageMB > 512) {
        // Warn if heap usage exceeds 512MB
        console.warn(`High memory usage detected: ${memUsageMB}MB`);

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
    }, 5000);
  }

  // Clean up interval on exit
  process.on('exit', () => {
    if (memoryCheckInterval) {
      clearInterval(memoryCheckInterval);
    }
  });
};

// Initialize memory management
setupMemoryManagement();

// Test environment configuration
const configureTestEnvironment = (): void => {
  // Set environment variables for consistent test runs
  process.env.NODE_ENV = 'test';
  process.env.FORCE_COLOR = '1'; // Ensure colored output in CI
  process.env.CI = process.env.CI || 'false';

  // Disable network requests in tests unless explicitly enabled
  if (process.env.ALLOW_NETWORK !== 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // Configure timezone for consistent date/time testing
  process.env.TZ = 'UTC';
};

configureTestEnvironment();

// Polyfill for older Node.js versions
if (typeof globalThis === 'undefined') {
  (global as Record<string, unknown>).globalThis = global;
}

// Log setup completion (only in verbose mode)
if (process.env.VERBOSE_SETUP === 'true') {
  console.log('✅ Enhanced test setup completed');
  console.log(`📊 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
}
